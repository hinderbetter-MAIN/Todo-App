import React, { Component } from 'react'
import './App.css';
import ListItem from './ListItem';
import axios from 'axios';
import loadingGif from './loading.gif';



class App extends Component {

  constructor() {
    super();
    this.state = {
      newTodo: '',

      editing: false,

      editingIndex: null,

      notification: null,

      loading: true,

      todos: []
    };

    this.apiUrl = 'https://5d4a85ed5c331e00148eb354.mockapi.io';
    
    this.handleChange = this.handleChange.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.alert = this.alert.bind(this);
    this.editTodo = this.editTodo.bind(this);
  }

  async componentDidMount(){
    const response = await axios.get(`${this.apiUrl}/todos`);
    setTimeout(() => {
      this.setState({
        todos: response.data,
        loading: false,
      });
    }, 1000);
  }


  handleChange(event) {
    this.setState({
      newTodo: event.target.value
    });
  }

  async addTodo(){

    const response = await axios.post(`${this.apiUrl}/todos`, {
      name: this.state.newTodo,
    });

    //state is immutable.
    const todos = this.state.todos;

    todos.push(response.data);

    this.setState({
      todos: todos,
      newTodo: '',
    });

    this.alert('Todo Added Successfully');
  }

  async deleteTodo(index){
    const todos = this.state.todos;
    const todo = todos[index];

    await axios.delete(`${this.apiUrl}/todos/${todo.id}`);
    delete todos[index];

    this.setState({
      todos
    });

    this.alert('Todo Deleted Successfully');
  }

  updateTodo(index){
    const todo = this.state.todos[index];
    this.setState({
      editing: true,
      newTodo: todo.name,
      editingIndex: index
    });
  }

  async editTodo(){
    const todo = this.state.todos[this.state.editingIndex];

    const response = await axios.put(`${this.apiUrl}/todos/${todo.id}`, {
      name: this.state.newTodo
    });

    const todos = this.state.todos;
    todos[this.state.editingIndex] = response.data;
    this.setState({ todos, editing: false, editingIndex: null, newTodo: '' });

    this.alert('Todo Updated Successfully');
  }

  alert(notification) {
    this.setState({
      notification
    });

    setTimeout(() => {
      this.setState({
        notification: null
      });
    }, 2000);
  }

  render() {
    return (
      <div className="App">

      <div className="container">
        {
          this.state.notification &&
          <div className="alert m-3 alert-success">
            <p className="text-center">{this.state.notification}</p>
          </div>
        }
        <input 
          type="text" 
          className="my-4 form-control" 
          name="todo" 
          placeholder="Add Todo" 
          onChange={this.handleChange}
          value={this.state.newTodo}
        />

        <buttton
          onClick={this.state.editing ? this.editTodo: this.addTodo} 
          className="btn-success mb-3 form-control"
          >
            { this.state.editing ? 'Update Todo':'Add Todo' }
        </buttton>
        {
          this.state.loading &&
          <img src={loadingGif} alt="" />
        }

        {
          (!this.state.editing || this.state.loading) &&
          <ul className="list-group">
            {
              this.state.todos.map((item, index) => {
                return <ListItem
                  key={item.id} 
                  item={item}
                  updateTodo={() => {this.updateTodo(index); }}
                  deleteTodo={() => {this.deleteTodo(index); }}
                />;
              })
            }
          </ul>
        }

      </div>
    </div>
    );
  }

}
export default App;
