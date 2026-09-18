import type { BookingHistoryCategory } from "@/modules/class-history/types/booking-history-category.type";
import { Box, Button } from "@mui/material";
import { CATEGORY_TABS } from "@/modules/class-history/constants/classHistory.constants";
import { categoryTabSx, categoryTabsContainerSx } from "@/modules/class-history/styles/classHistoryStyles";


interface CategoryTabsProps {
    activeCategory: BookingHistoryCategory;
    onChange: (category: BookingHistoryCategory) => void;
}

export default function CategoryTabs({ activeCategory, onChange }: CategoryTabsProps) {
    return (
        <Box sx={categoryTabsContainerSx}>
            {CATEGORY_TABS.map(({ category, label }) => (
                <Button
                    key={category}
                    fullWidth
                    onClick={() => onChange(category)}
                    aria-pressed={activeCategory === category}
                    sx={categoryTabSx(activeCategory === category)}
                >
                    {label}
                </Button>
            ))}
        </Box>
    );
}