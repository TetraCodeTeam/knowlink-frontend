import { useEffect, useRef, useState } from "react";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { useMySubjectsWithCatalogId } from "@/modules/tutor/materials/hooks/useMySubjectsWithCatalogId";
import { useGetMaterials } from "@/modules/tutor/materials/hooks/useGetMaterials";
import MaterialCard from "@/modules/tutor/materials/components/MaterialCard";
import MaterialEmptyState from "@/modules/tutor/materials/components/MaterialEmptyState";
import UploadMaterialDialog from "@/modules/tutor/materials/components/UploadMaterialDialog";
import { uploadButtonSx } from "@/modules/tutor/materials/styles/materialsStyles";

export default function MaterialsSection() {
  const [selectedCatalogSubjectId, setSelectedCatalogSubjectId] = useState<string | undefined>();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [hasSubjectOverflow, setHasSubjectOverflow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { subjects, isLoading: isSubjectsLoading } = useMySubjectsWithCatalogId();
  const allCatalogSubjectIds = subjects.map((s) => s.catalogSubjectId);

  const { materials, isLoading: isMaterialsLoading } = useGetMaterials(allCatalogSubjectIds, selectedCatalogSubjectId);
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
  }, [subjects]);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: direction === "left" ? -120 : 120, behavior: "smooth" });
  };

  const chipSx = (active: boolean) => ({
    borderRadius: "20px",
    textTransform: "none",
    fontSize: "15px",
    fontWeight: active ? 600 : 400,
    whiteSpace: "nowrap",
    flexShrink: 0,
    minWidth: "fit-content",
    backgroundColor: active ? "#5865C8" : "transparent",
    color: active ? "#FFFFFF" : "#5865C8",
    border: `1px solid ${active ? "#5865C8" : "#C1BFE7"}`,
    px: 2.5,
    py: 0.75,
    "&:hover": {
      backgroundColor: active ? "#4954B5" : "#EEEDFE",
    },
  });

  return (
    <Box>
      {/* Filter bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}>
        {hasSubjectOverflow && (
          <IconButton size="small" onClick={() => scroll("left")} aria-label="Desplazar izquierda">
            <ChevronLeft size={18} />
          </IconButton>
        )}

        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            flex: 1,
            minWidth: 0,
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          <Button size="small" onClick={() => setSelectedCatalogSubjectId(undefined)} sx={chipSx(selectedCatalogSubjectId === undefined)}>
            Todo
          </Button>
          {subjects.map((subject) => (
            <Button
              key={subject.tutorSubjectId}
              size="small"
              onClick={() => setSelectedCatalogSubjectId(subject.catalogSubjectId)}
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

        <Button startIcon={<Upload size={15} />} onClick={() => setIsUploadOpen(true)} sx={uploadButtonSx}>
          Subir recurso
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Content */}
      {isLoading ? (
        <Typography sx={{ color: "#888", fontSize: "16px", py: 2 }}>Cargando materiales...</Typography>
      ) : materials.length === 0 ? (
        <MaterialEmptyState />
      ) : (
        <Box>
          {materials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </Box>
      )}

      <UploadMaterialDialog open={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </Box>
  );
}
