import React from "react";
import Button from "../components/UI/Button/Button";
import Input from "../components/UI/Input/Input";

function usePopup(
	addTask,
	activeFolder,
	deleteTask,
	changeDiscription,
	changeFolder,
	addFolder,
	deleteFolder,
	changeFolders,
	changeTask
) {
	const [isPopupActive, setIsPopupActive] = React.useState(false);
	const [popupType, setPopupType] = React.useState(null);
	const [popupData, setPopupData] = React.useState(null);
	const [popupInput, setPopupInput] = React.useState("");

	const openPopup = (type, data, defaultValue = "") => {
		setPopupInput(defaultValue);
		setPopupType(type);
		setPopupData(data);
		setIsPopupActive(true);
	};

	const handleAddTaskClick = (name) => {
		addTask(name, activeFolder);
		setIsPopupActive(false);
		setPopupInput("");
	};

	const handleChangeFolder = (name, id) => {
		changeFolder(id, name);
		setIsPopupActive(false);
		setPopupInput("");
		addFolder(name);
	};
	const handleChangeTask = (task, id) => {
		changeTask(id, task);
		setIsPopupActive(false);
		setPopupInput("");
	};

	const generatePopup = () => {
		if (!isPopupActive) {
			return null;
		}
		switch (popupType) {
			case "info":
				return (
					<>
						<div data-type='header'>
							<h1
								data-type='task'
								onClick={() => {
									openPopup(
										"input",
										{
											text: "Изменить задачу",
											placeholder: "Введите задачу",
											trueButton: handleChangeTask,
											args: [popupData.id],
										},
										popupData.task
									);
								}}
							>
								{popupData.task}
							</h1>
							<div className='icons'>
								{popupData.isComplete ? <p data-type='icons'>✅</p> : ""}
								{popupData.isImportant ? <p data-type='icons'>⭐️</p> : ""}
							</div>
						</div>
						<p
							data-type='folder'
							onClick={() => {
								openPopup(
									"input",
									{
										text: "Изменить папку",
										placeholder: "Введите название папки",
										trueButton: handleChangeFolder,
										args: [popupData.id],
									},
									popupData.folder
								);
							}}
						>
							{popupData.folder}
						</p>
						<textarea
							onChange={(event) => {
								changeDiscription(popupData.id, event.target.value);
							}}
							defaultValue={popupData.discription}
							placeholder='Описание задачи'
							name=''
							id=''
							cols='10'
							rows='10'
						/>
						<div data-type='buttons'>
							<Button onClick={() => setIsPopupActive(false)}>Закрыть</Button>
							<Button
								onClick={() =>
									openPopup("bool", {
										text: "Удалить задачу?",
										trueButton: () => deleteTask(popupData.id),
									})
								}
							>
								Удалить
							</Button>
						</div>
					</>
				);
			case "bool":
				return (
					<>
						<div data-type='header'>
							<h1>{popupData.text}</h1>
						</div>
						<div data-type='buttons'>
							<Button onClick={() => setIsPopupActive(false)}>Нет</Button>
							<Button
								onClick={() => {
									popupData.trueButton();
									setIsPopupActive(false);
								}}
							>
								Да
							</Button>
						</div>
					</>
				);
			case "input":
				return (
					<>
						<div data-type='header'>
							<h1>{popupData.text}</h1>
						</div>
						<Input
							data-type='input'
							autoFocus
							value={popupInput}
							onChange={(event) => {
								setPopupInput(event.target.value);
							}}
							placeholder={popupData.placeholder}
						/>
						<div data-type='buttons'>
							<Button onClick={() => setIsPopupActive(false)}>Отмена</Button>
							<Button onClick={() => popupData.trueButton(popupInput, [...popupData.args])}>OK</Button>
						</div>
					</>
				);
			case "folders":
				return (
					<>
						<div data-type='header'>
							<h1>{popupData.text}</h1>
						</div>

						<div data-type='foldersList'>
							{!popupData.folders.length ? <p data-type='foldersMessage'>Нет пользовательских папок 🧐</p> : null}
							{popupData.folders.map((item) => {
								return (
									<div data-type='folderItem' key={item}>
										<p data-type='folderSelect'>{item}</p>
										<p
											data-type='folderDelete'
											onClick={() => {
												openPopup("bool", {
													text: "Удалить папку?",
													trueButton: () => {
														changeFolders(item);
														deleteFolder(item);
													},
													args: [item],
												});
											}}
										>
											❌
										</p>
									</div>
								);
							})}
						</div>
						<div data-type='buttons'>
							<Button onClick={() => setIsPopupActive(false)}>OK</Button>
							<Button onClick={() => popupData.trueButton(popupInput, [...popupData.args])}>Создать папку</Button>
						</div>
					</>
				);
		}
	};

	return {
		isPopupActive,
		popupType,
		popupData,
		popupInput,
		handleAddTaskClick,
		generatePopup,
		setIsPopupActive,
		handleChangeFolder,
		openPopup,
	};
}

export default usePopup;
