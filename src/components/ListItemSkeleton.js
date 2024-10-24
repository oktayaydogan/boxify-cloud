export default function ListItemSkeleton() {
	return (
		<>
			{[1, 2, 3].map((_, index) => (
				<div
					key={index}
					className="animate-pulse flex items-center justify-between p-4 border rounded-lg hover:shadow-lg transition duration-300 gap-4"
				>
					<div className="flex-grow flex flex-col gap-3">
						<div className="h-5 w-3/4 bg-gray-200 rounded-lg"></div>
						<div className="h-4 w-2/4 bg-gray-200 rounded-lg"></div>
					</div>
					<div className="px-4 py-2 h-10 w-12 bg-gray-200 rounded-lg"></div>
				</div>
			))}
		</>
	);
}
