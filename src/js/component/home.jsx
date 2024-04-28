import React from "react";
import { useState, useEffect } from "react";

const Home = () => {

	const [inputValue, setInputValue] = useState("")
	const [user, setUser] = useState(undefined)
	const [userInput, setUserInput] = useState("")
	const [userList, setUserList] = useState([])

	////////////////////////////////////////////////////////////

	const createUser = async (username) => {
		await fetch(`https://playground.4geeks.com/todo/users/${username}`, {
			method: "POST"
		}).then(res => {
			if (!res.ok) {
				console.log(`User already exists`)
			} else {
				console.log(`Creating user ${username}`)
			}
		})
	}

	const getUser = async (username) => {
		await fetch(`https://playground.4geeks.com/todo/users/${username}`)
			.then(res => {
				if (res.ok) {
					return res.json();
				}
			}).then(u => {
				if (u) {
					setUser(u);
				}
			});
	}

	const deleteUser = async () => {
		await fetch(`https://playground.4geeks.com/todo/users/${user.name}`, {
			method: "DELETE"
		}).then(res => {
			if (res.ok) {
				getAllUsers()
				setUser(undefined)
			}
		})
	}

	const validateUser = async (e) => {
		if (e.key === "Enter") {
			const userInputLower = userInput.toLowerCase()
			const userListLower = userList.map(el => el.name.toLowerCase())
			if (userInput !== "" && !userListLower.includes(userInputLower)) {
				await createUser(userInput);
				getAllUsers()
			} else {
				alert("User already exists")
			}
			setUserInput("");
		}
	}

	const getAllUsers = async () => {
		const usersReq = await fetch(`https://playground.4geeks.com/todo/users`)
		const jsonUsers = await usersReq.json()
		setUserList(jsonUsers.users)
	}

	const handleSelectUser = (username) => {
		getUser(username)
	}
	
	////////////////////////////////////////////////////////////
	
	const handleAddItem = async (task) => {
		try {
			await fetch(`https://playground.4geeks.com/todo/todos/${user.name}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					"label": task,
					"is_done": false
				})
			}).then(res => {
				if (res.ok) {
					return res.json()
				}
			}).then(resJson => {
				const newUser = {
					...user,
					todos: [...user.todos, resJson]
				}
				setUser(newUser)
			})

		} catch {
			alert("No user selected")
		}
		setInputValue("")
	}

	const validateInput = (task) => {
		if (!task || !task.trim()) {
			console.log("Input cannot be empty")
		} else handleAddItem(task)
	}

	const handleKeyEnter = (e) => {
		if (e.key === "Enter") {
			validateInput(inputValue);
		}
	}

	const handleDelete = async (task) => {
		const id = task.id
		await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
			method: "DELETE"
		}).then(res => {
			if (res.ok) {
				const userTasks = user.todos.filter(item => item.id !== id)
				const newUser = {
					...user,
					todos: [...user.todos, userTasks]
				}
				setUser(newUser)
				getUser(newUser.name)
			}
		})
	}

	const checkItemNumber = () => {
		const numOfItems = user?.todos.length
		if (!user) {
			return "Select or create a user"
		} if (numOfItems === 0) {
			return "No tasks, add a task"
		} else return `${numOfItems} ${numOfItems === 1 ? "item" : "items"} left`
	}
	
	////////////////////////////////////////////////////////////

	useEffect(() => {
		getAllUsers()
	}, [])

	return (
		<div className="text-center pt-5">
			<h1 className="text-secondary font-monospace mb-0">ToDo List API Fetch</h1>
			<small className="text-secondary font-monospace">By Charlie</small>
			<div className="mx-auto col-7 d-flex align-items-center justify-content-around mt-3">
				<p className="m-0">Current User: {!user ? "none" : user.name}</p>
				<button onClick={() => deleteUser()} className="btn btn-danger">Delete User</button>
			</div>
			<div className="mx-auto col-7 mt-3">
				<div className="input-group">
					<span className="input-group-text">Add a User</span>
					<input onChange={e => setUserInput(e.target.value)} onKeyDown={validateUser} value={userInput} className="form-control" type="text" />
				</div>
			</div>
			<div className="mx-auto col-7 mt-3">
				{
					<ul className="list-group list-group-horizontal d-flex flex-wrap">
						{userList && userList.map((user) => (
							<li onClick={() => handleSelectUser(user.name)} className="list-group-item flex-fill w-50 border rounded" key={user.id}>{user.name}</li>
						))}
					</ul>
				}
			</div>
			<div className="col-7 col-xl-5 mx-auto mt-3 d-flex flex-column">
				<input id="input" type="text" className="form-control border rounded-0 py-3 px-4 fs-5" placeholder="What needs to be done?"
					onChange={e =>
						setInputValue(e.target.value)} value={inputValue} onKeyDown={handleKeyEnter} />
				<ul id="list" className="list-group">{user?.todos.map((elem, index) => (
					<li id="list-item" className="text-start list-group-item rounded-0 border-top-0 d-flex align-items-center justify-content-between" key={index}>
						<span className="ms-4 fs-5">{elem.label}</span>
						<button onClick={() => handleDelete(elem)} className="btn-close me-2 hoverX"></button>
					</li>
				))}</ul>
				<p className="text-secondary text-end border border-top-0 pe-4">{checkItemNumber()}</p>
			</div>
		</div>
	);
};

export default Home;
