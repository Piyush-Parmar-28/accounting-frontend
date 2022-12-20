import React, { useRef } from "react";
import Icon from "./Icon";

interface Props {
	children: any;
	id: string; // id must be unique
}

const ScrollToBottom = ({ children, id }: Props) => {
	const upArrowRef = useRef<HTMLDivElement | null>(null);
	const downArrowRef = useRef<HTMLDivElement | null>(null);
	const topOfPageRef = useRef<HTMLDivElement | null>(null);
	const bottomOfPageRef = useRef<HTMLDivElement | null>(null);

	const observer = new IntersectionObserver(
		(entries) => {
			if (downArrowRef.current) {
				if (entries[0].isIntersecting) {
					downArrowRef.current!.classList.add("hidden");
				} else {
					downArrowRef.current!.classList.remove("hidden");
				}
			}
		},
		{ threshold: 1 }
	);

	const observer2 = new IntersectionObserver(
		(entries) => {
			if (upArrowRef.current) {
				if (entries[0].isIntersecting) {
					upArrowRef.current!.classList.add("hidden");
				} else {
					upArrowRef.current!.classList.remove("hidden");
				}
			}
		},
		{ threshold: 1 }
	);

	bottomOfPageRef.current && observer.observe(bottomOfPageRef.current);
	topOfPageRef.current && observer2.observe(topOfPageRef.current);

	return (
		<>
			<div
				ref={topOfPageRef}
				id={`topOfPage-${id}`}
				className="w-full h-1"
			></div>
			{children}
			<div
				ref={bottomOfPageRef}
				id={`bottomOfPage-${id}`}
				className="w-full h-1"
			></div>
			<div className="grid gap-y-3 fixed z-20 bottom-6 right-10">
				<div ref={upArrowRef} className="h-12 w-12">
					<a
						href={`#topOfPage-${id}`}
						className="h-full w-full grid place-items-center border-2 bg-indigo-600 border-indigo-600 rounded-full cursor-pointer shadow-lg hover:bg-indigo-700 hover:border-indigo-70"
					>
						<Icon
							name="dropdown-arrow"
							className="mb-0.5 w-6 h-6 -rotate-90 stroke-white stroke-[3]"
						/>
					</a>
				</div>
				<div ref={downArrowRef} className="h-12 w-12">
					<a
						href={`#bottomOfPage-${id}`}
						className="h-full w-full grid place-items-center border-2 bg-indigo-600 border-indigo-600 rounded-full cursor-pointer shadow-lg hover:bg-indigo-700 hover:border-indigo-700"
					>
						<Icon
							name="dropdown-arrow"
							className="mt-0.5 w-6 h-6 rotate-90 stroke-white stroke-[3]"
						/>
					</a>
				</div>
			</div>
		</>
	);
};

export default ScrollToBottom;
