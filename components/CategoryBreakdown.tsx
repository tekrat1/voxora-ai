interface CategoryAverage {
    name: string;
    avg: number;
}

const barColor = (avg: number) => {
    if (avg >= 80) return "bg-success-100";
    if (avg >= 60) return "bg-primary-200";
    return "bg-destructive-100";
};

const CategoryBreakdown = ({
                               categories,
                           }: {
    categories: CategoryAverage[];
}) => {
    if (categories.length === 0) return null;

    return (
        <div className="flex flex-col gap-4">
            {categories.map((category) => (
                <div key={category.name} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-light-100">
                            {category.name}
                        </p>
                        <p className="text-sm font-semibold text-white">
                            {category.avg}
                            <span className="text-light-400 text-xs font-normal">/100</span>
                        </p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                        <div
                            className={`h-full rounded-full ${barColor(category.avg)} transition-all`}
                            style={{ width: `${Math.max(category.avg, 2)}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CategoryBreakdown;
