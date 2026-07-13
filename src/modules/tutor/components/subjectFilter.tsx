import { useRef, useState, useEffect } from "react";
import { Box, Chip, IconButton, Stack } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SubjectFilterBarProps {
  subjects: string[];
  selected: string | null;
  onSelect: (subject: string | null) => void;
}

const SCROLL_AMOUNT = 300;

export const SubjectFilterBar = ({ subjects, selected, onSelect }: SubjectFilterBarProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();
  }, [subjects]);

  const scrollBy = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      {canScrollLeft && (
        <IconButton size="small" onClick={() => scrollBy(-SCROLL_AMOUNT)}>
          <ChevronLeft size={18} />
        </IconButton>
      )}

      <Box
        ref={scrollRef}
        onScroll={updateScrollButtons}
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          py: 0.5,
        }}
      >
        <Chip
          label="Todo"
          size="medium"
          onClick={() => onSelect(null)}
          color={selected === null ? "primary" : "default"}
          variant={selected === null ? "filled" : "outlined"}
          sx={{ flexShrink: 0, borderRadius: 2, fontSize:"16px" }}
        />
        {subjects.map((subject) => (
          <Chip
            key={subject}
            label={subject}
            size="medium"
            onClick={() => onSelect(subject)}
            color={selected === subject ? "primary" : "default"}
            variant={selected === subject ? "filled" : "outlined"}
            sx={{ flexShrink: 0, borderRadius: 2, fontSize:"16px"}}
          />
        ))}
      </Box>

      {canScrollRight && (
        <IconButton size="small" onClick={() => scrollBy(SCROLL_AMOUNT)}>
          <ChevronRight size={18} />
        </IconButton>
      )}
    </Stack>
  );
};