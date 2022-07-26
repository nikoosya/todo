import React from "react";
import { Context } from "./context";

import TodoList from "./components/TodoList/TodoList";
import Header from "./components/Header/Header";
import Popup from "./components/Popup/Popup";
import Message from "./components/Message/Message";

import useTasks from "./hooks/useTasks";
import useFolders from "./hooks/useFolders";
import usePopup from "./hooks/usePopup";

import styles from "./index.module.scss";

function App() {
	const [searchValue, setSearchValue] = React.useState("");
	const [activeFolder, setActiveFolder] = React.useState("Активные");

	const stringValidate = (str) => {
		return !(!str || str.trim() === "");
	};

	const handleChangeFolderClick = (data) => {
		openPopup("input", data);
	};

	const {
		prepareTasks,
		tasks,
		addTask,
		deleteTask,
		changeIsDone,
		changeIsImportant,
		changeFolder,
		changeDiscription,
		changeFolders,
		changeTask,
	} = useTasks(activeFolder, searchValue, stringValidate);

	const { folders, addFolder, deleteFolder } = useFolders();
	const { isPopupActive, handleAddTaskClick, generatePopup, handleChangeFolder, openPopup } = usePopup(
		addTask,
		activeFolder,
		deleteTask,
		changeDiscription,
		changeFolder,
		addFolder,
		deleteFolder,
		changeFolders,
		changeTask
	);

	const preparedTasks = prepareTasks(tasks);
	let popupContent = generatePopup();

	const message =
		!preparedTasks.length && activeFolder !== "Выполненные" && !searchValue
			? "Нет активных задач 🥳"
			: !preparedTasks.length && activeFolder === "Выполненные" && !searchValue
			? "Нет выполненных задач 🙁"
			: searchValue && !preparedTasks.length
			? "Задачи не найдены 😔"
			: null;

	return (
		<Context.Provider
			value={{
				handleAddTaskClick,
				deleteTask,
				changeIsImportant,
				changeIsDone,
				changeFolder,
				addFolder,
				handleChangeFolderClick,
				handleChangeFolder,
				openPopup,
				setActiveFolder,
				setSearchValue,
			}}
		>
			<div className={styles.wrapper}>
				<Header folders={folders} activeFolder={activeFolder} />
				{message ? <Message>{message}</Message> : null}
				<TodoList tasks={preparedTasks} activeFolder={activeFolder} />
				{popupContent ? <Popup trigger={isPopupActive}> {popupContent}</Popup> : null}
			</div>
		</Context.Provider>
	);
}

export default App;
