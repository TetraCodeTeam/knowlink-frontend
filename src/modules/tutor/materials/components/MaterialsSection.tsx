import { useEffect, useRef, useState } from "react";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { useMySubjectsWithCatalogId } from "@/modules/tutor/materials/hooks/useMySubjectsWithCatalogId";
import { useGetMaterials } from "@/modules/tutor/materials/hooks/useGetMaterials";
import MaterialCard from "@/modules/tutor/materials/components/MaterialCard";
import MaterialEmptyState from "@/modules/tutor/materials/components/MaterialEmptyState";
import UploadMaterialDialog from "@/modules/tutor/materials/components/UploadMaterialDialog";
import DeleteMaterialDialog from "@/modules/tutor/materials/components/DeleteMaterialDialog";
import MaterialPreviewDialog from "@/shared/material-preview/components/MaterialPreviewDialog";
import type { Material } from "@/modules/tutor/materials/interfaces/material.interface";
import { getMaterialDisplayName } from "@/modules/tutor/materials/utils/materials.utils";
import { uploadButtonSx } from "@/modules/tutor/materials/styles/materialsStyles";

export default function MaterialsSection() {
  const [selectedCatalogSubjectId, setSelectedCatalogSubjectId] = useState<string | undefined>();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
  const [materialToPreview, setMaterialToPreview] = useState<Material | null>(null);
  const [hasSubjectOverflow, setHasSubjectOverflow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { subjects, isLoading: isSubjectsLoading } = useMySubjectsWithCatalogId();
  const allCatalogSubjectIds = subjects.map((s) => s.catalogSubjectId);

  const { materials, isLoading: isMaterialsLoading } = useGetMaterials(
    allCatalogSubjectIds,
    selectedCatalogSubjectId
  );
  const isLoading = isSubjectsLoading || isMaterialsLoading;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setHasSubjectOverflow(el.scrollWidth > el.clientWidth);
    };

    checkOverflow();
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);
    window.addEventListener("resize", checkOverflow);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkOverflow);
    };
  }, [subjects, selectedCatalogSubjectId]);

  useEffect(() => {
    scrollRef.current
      ?.querySelector<HTMLElement>('[aria-pressed="true"]')
      ?.scrollIntoView?.({ behavior: "smooth", inline: "nearest", block: "nearest" });
  }, [selectedCatalogSubjectId]);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: direction === "left" ? -120 : 120, behavior: "smooth" });
  };

  const chipSx = (active: boolean) => ({
    borderRadius: "20px",
    textTransform: "none",
    fontSize: "13px",
    fontWeight: active ? 600 : 400,
    whiteSpace: "nowrap",
    flexShrink: 0,
    minWidth: "fit-content",
    backgroundColor: active ? "#5865C8" : "transparent",
    color: active ? "#FFFFFF" : "#5865C8",
    border: `1px solid ${active ? "#5865C8" : "#C1BFE7"}`,
    px: 2,
    py: 0.5,
    "&:hover": {
      backgroundColor: active ? "#4954B5" : "#EEEDFE",
    },
  });

  return (
    <Box>
      {/* Filter bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: { xs: "wrap", sm: "nowrap" },
          gap: 0.5,
          mb: 1.5,
        }}
      >
        {hasSubjectOverflow && (
          <IconButton size="small" onClick={() => scroll("left")} aria-label="Desplazar izquierda">
            <ChevronLeft size={18} />
          </IconButton>
        )}

        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            gap: 1,
            overflowX: "auto",
            flex: { xs: "1 1 100%", sm: 1 },
            minWidth: 0,
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          <Button
            size="small"
            onClick={() => setSelectedCatalogSubjectId(undefined)}
            aria-pressed={selectedCatalogSubjectId === undefined}
            sx={chipSx(selectedCatalogSubjectId === undefined)}
          >
            Todo
          </Button>
          {subjects.map((subject) => (
            <Button
              key={subject.tutorSubjectId}
              size="small"
              onClick={() => setSelectedCatalogSubjectId(subject.catalogSubjectId)}
              aria-pressed={selectedCatalogSubjectId === subject.catalogSubjectId}
              sx={chipSx(selectedCatalogSubjectId === subject.catalogSubjectId)}
            >
              {subject.subjectName}
            </Button>
          ))}
        </Box>

        {hasSubjectOverflow && (
          <IconButton size="small" onClick={() => scroll("right")} aria-label="Desplazar derecha">
            <ChevronRight size={18} />
          </IconButton>
        )}

        <Button
          startIcon={<Upload size={15} />}
          onClick={() => setIsUploadOpen(true)}
          sx={uploadButtonSx}
        >
          Subir recurso
        </Button>
      </Box>

      <Divider sx={{ mb: 1.5 }} />

      {/* Content */}
      {isLoading ? (
        <Typography sx={{ color: "#888", fontSize: "14px", py: 2 }}>
          Cargando materiales...
        </Typography>
      ) : materials.length === 0 ? (
        <MaterialEmptyState />
      ) : (
        <Box>
          {materials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              onDelete={setMaterialToDelete}
              onPreview={setMaterialToPreview}
            />
          ))}
        </Box>
      )}

      <UploadMaterialDialog
        open={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploaded={setSelectedCatalogSubjectId}
      />

      {materialToDelete && (
        <DeleteMaterialDialog
          material={materialToDelete}
          open
          onClose={() => setMaterialToDelete(null)}
        />
      )}

      <MaterialPreviewDialog
        open={materialToPreview !== null}
        onClose={() => setMaterialToPreview(null)}
        material={
          materialToPreview && {
            id: materialToPreview.id,
            title: getMaterialDisplayName(materialToPreview),
            format: materialToPreview.format,
          }
        }
      />
    </Box>
  );
}
