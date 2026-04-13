// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { BsCalendar3, BsArrowRight } from 'react-icons/bs';
import { MdTrendingUp } from 'react-icons/md'

const Card = ({
    children,
    className = '',
    hoverable = false,
    padding = 'md',
    ...props
}) => {
    const paddingClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };
    return (
        <motion.div
            whileHover={hoverable ? { y: -8, scale: 1.02 } : {}}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`
        bg-white rounded-2xl border border-gray-200 
        transition-all duration-300
        ${hoverable ? 'hover:shadow-xl cursor-pointer' : 'shadow-sm'}
        ${paddingClasses[padding]}
        ${className}
      `}
            {...props}
        >
            {children}
        </motion.div>
    );
};

// Shimmer Loading Component
const ShimmerCard = () => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 overflow-hidden">
        <div className="animate-pulse">
            {/* Image Skeleton */}
            <div className="w-full h-48 bg-gray-200 rounded-xl mb-4" />

            {/* Content Skeleton */}
            <div className="space-y-3">
                {/* Category and Date */}
                <div className="flex items-center justify-between">
                    <div className="h-3 bg-gray-200 rounded w-20" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-full" />
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>

                {/* Read More */}
                <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
        </div>
    </div>
);

export const BlogCard = ({
    image,
    category,
    date,
    title,
    description,
    link = "#",
    isLoading = false
}) => {
    if (isLoading) return <ShimmerCard />;

    return (
        <Card hoverable padding="sm" className="overflow-hidden">
            {/* Image */}
            <motion.div
                className="w-full h-48 rounded-xl overflow-hidden mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
            >
                {image ? (
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300" />
                )}
            </motion.div>

            {/* Content */}
            <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                {/* Category and Date */}
                <div className="flex items-center justify-between">
                    <span className="text-green-700 font-semibold text-xs uppercase tracking-wide">
                        {category}
                    </span>
                    <div className="flex items-center text-gray-400 text-xs">
                        <BsCalendar3 className="mr-1" />
                        {date}
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                    {description}
                </p>

                {/* Read More Link */}
                <motion.a
                    href={link}
                    className="inline-flex items-center text-green-700 font-semibold text-sm hover:text-green-800 transition-colors group"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                >
                    Read More
                    <BsArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                </motion.a>
            </motion.div>
        </Card>
    );
};

export const TrendingCard = ({
    image,
    title,
    description,
    isTrending = false,
    link = "#",
    isLoading = false
}) => {
    if (isLoading) return <ShimmerCard />;

    return (
        <Card hoverable padding="sm" className="overflow-hidden">
            {/* Image with Trending Badge */}
            <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
                <motion.div
                    className="w-full h-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    {image ? (
                        <img src={image} alt={title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-linear-to-br from-orange-200 to-yellow-300" />
                    )}
                </motion.div>

                {/* Trending Badge */}
                {isTrending && (
                    <motion.div
                        className="absolute top-3 left-3"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.2
                        }}
                    >
                        <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg">
                            <MdTrendingUp className="mr-1" />
                            Trending
                        </span>
                    </motion.div>
                )}
            </div>

            {/* Content */}
            <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                    {description}
                </p>

                {/* Read More Link */}
                <motion.a
                    href={link}
                    className="inline-flex items-center text-green-700 font-semibold text-sm hover:text-green-800 transition-colors group"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                >
                    Read More
                    <BsArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                </motion.a>
            </motion.div>
        </Card>
    );
};

// Export the shimmer component for standalone use
export { ShimmerCard };
