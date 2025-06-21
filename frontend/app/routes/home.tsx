import { useEffect, useRef } from "react";
import { redirect } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	const RENDER_NUMBER = 161; // Number of items to render
	const INITIAL_COLS = 20; // Initial number of columns

	// const calcMonthLabel = (): {month: number, } => {

	const test = [
		{
			month: 5,
			col: 20,
			year: 2025,
		},
	];

	const ref = useRef<HTMLDivElement>(null);

	const initialDate = useRef<{
		day: number;
		index: number;
	}>({
		day: new Date().getDay(),
		index: INITIAL_COLS * 7 + new Date().getDay(),
	});

	useEffect(() => {
		ref.current?.scrollTo({
			left: ref.current.scrollWidth,
		});
	}, []);

	return (
		<div className="w-[70%] mx-auto">
			<div
				className="w-full aspect-[10/3] bg-gray-300 overflow-x-scroll flex flex-col relative text-indigo-950"
				ref={ref}
			>
				?
				<div className="flex flex-nowrap flex-row-reverse w-full h-full overflow-x-scroll gap-x-[0.5%] relative pt-[2%]">
					<div className="flex flex-nowrap flex-row-reverse w-full gap-x-[0.5%] h-[5%] absolute top-0 right-0">
						<div
							className="w-full grid grid-cols-23 py-[0.5%] gap-x-[0.5%] gap-y-[2%] h-full shrink-0 grid-flow-col-dense"
							style={{ direction: "rtl" }}
						>
							{Array.from({ length: 23 }).map((_, index) => (
								<span
									key={index}
									className="text-xs text-gray-500"
									style={{ width: "100%" }}
								>
									{index + 1}
								</span>
							))}
						</div>
					</div>

					<div
						className="grid grid-rows-7 py-[0.5%] gap-x-[0.5%] gap-y-[2%] w-full h-full shrink-0 grid-flow-col-dense"
						style={{ gridTemplateColumns: "repeat(23, 1fr)" }}
					>
						{Array.from({ length: RENDER_NUMBER }).map((_, index) => (
							<div
								key={index}
								className="bg-white rounded-[2%] shadow-sm"
								style={{
									width: "100%",
									height: "100%",
									backgroundColor:
										index === initialDate.current.index ? "lightblue" : "white",
								}}
							>
								{/* {index - RENDER_NUMBER} */}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
