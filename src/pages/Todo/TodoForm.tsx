/* This example requires Tailwind CSS v2.0+ */

import { formatDate } from "../../helpers/formatDate";
import Icon from "../../components/Icon";
import { useState } from "react";

import { compose } from "redux";
import { withRouter } from "../../helpers/withRouter";
import { connect, ConnectedProps } from "react-redux";
import { ADD_NOTIFICATION, UPDATE_COMMON } from "../../store/types";

//Redux mapping
const mapStateToProps = (state: any) => ({
	...state.notification,
	...state.common,
});

const mapDispatchToProps = (dispatch: any) => ({
	updateCommon: (payload: any) => dispatch({ type: UPDATE_COMMON, payload }),
	onNotify: (title: string, message: string, type: string) =>
		dispatch({
			type: ADD_NOTIFICATION,
			payload: {
				title,
				message,
				type,
			},
		}),
});
const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface FormProps {
	todoTemp?: any;
	setTodoData?: any;
	addTodo?: any;
}

function TodoForm(props: FormProps & PropsFromRedux) {
	const { todoTemp, setTodoData, addTodo } = props;

	const [logging, setLogging] = useState(false);

	const onChange = (e: any) => {
		setTodoData({
			...todoTemp,
			[e.target.name]: e.target.value,
		});
		console.log(todoTemp);
	};

	const handleSave = () => {
		setLogging(true);
		addTodo(todoTemp);
		setTodoData({
			toDo: "",
			description: "",
			date: new Date(),
			star: false,
			reminderDate: new Date(),
			recurring: false,
			recurringPeriodCount: 1,
		});
		setLogging(false);
	};

	const onSubmit = (e: any) => {
		e.preventDefault();
		handleSave();
	};

	return (
		<form
			className={`w-full mt-5 p-2 bg-white flex-col sm:items-center ring-2 ring-black ring-opacity-10`}
			onSubmit={onSubmit}
		>
			<div className="w-full group relative px-4 py-3 sm:p-3">
				<div className="flex gap-4">
					<label htmlFor={`toDo`} className="sr-only">
						Add New Todo
					</label>
					<input
						type="text"
						name="toDo"
						id={`toDo`}
						value={todoTemp?.toDo}
						onChange={onChange}
						placeholder="Add New Todo"
						className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder-gray-600 pr-20"
						onKeyPress={(e: any) => {
							if (e.charCode === 13) {
								handleSave();
							}
						}}
					/>
					<div className={`hidden group-focus-within:flex absolute right-6`}>
						<input
							type="date"
							name="reminderDate"
							id={`reminderDate`}
							value={formatDate(todoTemp?.reminderDate, true)}
							onChange={onChange}
							className={`placeholder-gray-600 sm:text-sm bg-transparent outline-none cursor-pointer text-gray-600 text-sm w-[4.18rem] transition-[width] duration-300 -mr-2 border-none focus:border-none focus:outline-none focus:shadow-none focus:bg-white`}
							onClick={(e) =>
								((e.target as HTMLInputElement).style.width = "8.1rem")
							}
							onFocus={(e) =>
								((e.target as HTMLInputElement).style.width = "8.1rem")
							}
							onBlur={(e) =>
								((e.target as HTMLInputElement).style.width = "4.16rem")
							}
						/>
						<button
							className={`relative isolate grid place-items-center rounded-md`}
							tabIndex={-1}
						>
							<input
								type="checkbox"
								name="star"
								id="star"
								checked={todoTemp?.star}
								onChange={() =>
									setTodoData({
										...todoTemp,
										star: !todoTemp?.star,
									})
								}
								className="row-span-full col-span-full rounded-md w-full h-full px-2 border-transparent z-10 bg-transparent focus:ring-0 opacity-0 cursor-pointer peer"
							/>
							<Icon
								name="outline/star"
								className={`row-span-full col-span-full h-4 w-4 ${
									todoTemp?.star
										? "fill-yellow-500 stroke-yellow-500"
										: "fill-none stroke-gray-500"
								}`}
							/>
						</button>
					</div>
				</div>
				<label htmlFor={`description`} className="sr-only">
					Todo Description
				</label>
				<textarea
					name="description"
					id={`description`}
					value={todoTemp?.description}
					onChange={onChange}
					placeholder={`Description 2000 char max.\n\n(Shift + Enter for new line.)`}
					className={`hidden group-focus-within:block min-w-full min-h-[6rem] rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mt-2 placeholder-gray-600`}
					onKeyPress={(e: any) => {
						if (e.charCode === 13 && !e.shiftKey) {
							// Don't generate a new line
							e.preventDefault();
							handleSave();
						}
					}}
				/>
				<div
					className={`hidden group-focus-within:flex items-center justify-between mt-2 ml-3 relative`}
				>
					<p className={`text-[15px] font-medium text-gray-600`}>
						Press Enter To Save Todo
					</p>
					<button
						type="button"
						className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none absolute right-3 bottom-10"
						onClick={handleSave}
					>
						{logging ? <Icon name="loading" /> : null}
						Save
					</button>
				</div>
			</div>
		</form>
	);
}

export default compose(
	connector,
	withRouter
)(TodoForm) as React.ComponentType<FormProps>;
