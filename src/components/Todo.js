import { useState, useEffect } from "react";
import axios  from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Todo() {
    const [name,setName] = useState('');
    const [task,setTask] = useState('');
    const [todos, setTodos] = useState([]);
    const [show, setShow] = useState(false);
    const [editname, setEditName] = useState('');
    const [edittask, setEditTask] = useState('');
    const [editid,setEditId] = useState();
    const [IsCompleted, setIsCompleted] = useState(0);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    const getData = () => {
        axios.get('https://localhost:7210/api/TodoListControllers')
        .then(result => {
            setTodos(result.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
     getData();
    }, [])

    const handleSubmit = () => {
        const url = "https://localhost:7210/api/TodoListControllers";
        const data = {
            "name": name,
            "task": task,
            "isCompleted": false
        }

        axios.post(url,data)
        .then((result) => {
            getData();
            clear();
            toast.success("Todo has been added");
        }
        ).catch((error) => {
        toast.success(error)
    })
    }

    const clear = () => {
        setName('');
        setTask('');
        setEditTask('');
        setEditName('');
        setEditId('');
        setIsCompleted(0);
    }

    const handleUpdate = (id,name,task,isCompleted) => {
        const url = `https://localhost:7210/api/TodoListControllers/${id}`;
        const data = {
            "name": name,
            "task": task,
            "isCompleted": isCompleted
        }
        axios.put(url,data)
        .then((result) => {
            getData();
        }).catch((error) => {
            toast.success(error);
        })

    }
    const handleDelete = (id) => {
        if (window.confirm("Are you sure to delete this todo") === true){
            axios.delete(`https://localhost:7210/api/TodoListControllers/${id}`)
            .then((result) => {
                if (result.status === 200){
                    toast.success('Todo has been deleted');
                    getData();
                }
            })
            .catch((error)=> {
                toast.success(error);
            })
        }
    }

  const handleUpdatee = () => {
    const url = `https://localhost:7210/api/TodoListControllers/${editid}`;
    const data = {
        "name": editname,
        "task": edittask,
        "IsCompleted": IsCompleted
    }
    axios.put(url,data)
    .then((result) => {
        getData();
        clear();
        toast.success('Todo has been updated');
    }).catch((error) => {
        toast.success(error);
    })
  }
  const handleEdit = (id) => {
    handleShow();
    axios.get(`https://localhost:7210/api/TodoListControllers/${id}`)
    .then((result) => {
        setEditName(result.data.name);
        setEditTask(result.data.task);
        setIsCompleted(result.data.IsCompleted);
        setEditId(id);
    })
    .catch((error) => {
        toast.success(error);
    })
  }
    const newTodoSection = 
        <form>
            <h1 className="todoheading">Todo List</h1>
            <label>Enter new todo list</label>
            <div className="inputs">
            <input
                type="text"
                id="inputs"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your Name"
                />
            </div>
            <div className="task-input">
            <input
                type="text"
                id="task-input"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Enter your Task"
                />
            </div>
            <button className="submit" onClick={handleSubmit}>
             Submit
            </button>
            </form>


    const content = todos && todos.map((todo) => {
                            return (
                                <article key={todo.Id}>
                                    <div className="todo">
                                        <input
                                            type="checkbox"
                                            checked={todo.isCompleted}
                                            id={todo.id}
                                            onChange={() => {
                                                handleUpdate(todo.id,todo.name,todo.task,!todo.isCompleted)
                                            }}
                                        />
                                        <label htmlFor={todo.id}>Name: {todo.name}<br/>
                                        Task: {todo.task}
                                        </label>
                                    </div>
                                    <button className="edit" onClick={() => handleEdit(todo.id)}>
                                        <FontAwesomeIcon icon={faPenToSquare} /></button>
                                    <button className="trash" onClick={() => handleDelete(todo.id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </article>
                            )
                        })

    

    return (

       <>
    <main>
       <ToastContainer/>
        {newTodoSection}
        {content}
    </main>
    <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
    <Modal.Title>Edit Todo</Modal.Title>
    </Modal.Header>
   <Modal.Body>
    <Row>
        <Col>
        <input
         type="text"
         className="form-control"
         style={{width:'100%'}}
         value={editname}
         onChange={(e) => setEditName(e.target.value)}
         placeholder="Enter your Name" />
        </Col>
        <Col>
        <input
        type="text"
        className="form-control"
        value={edittask}
        style={{width:'100%'}}
        onChange={(e) => setEditTask(e.target.value)}
        placeholder="Enter your Task"
        /></Col>
    </Row>
   </Modal.Body>
    <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Close
    </Button>
    <Button variant="primary" onClick={() => handleUpdatee()}>
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>
</>
    )
}

export default Todo;