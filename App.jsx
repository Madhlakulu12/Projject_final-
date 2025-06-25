
import React, { useState } from 'react';

export default function TodoListApp() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState('');
  const [tasks, setTasks] = useState({});
  const [reportVisible, setReportVisible] = useState(false);

  const handleLogin = () => {
    if (user.trim() !== '' && password === '1234') {
      setLoggedIn(true);
    } else {
      alert('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUser('');
    setPassword('');
  };

  const addProject = () => {
    if (newProject.trim() === '') return;
    setProjects([...projects, { name: newProject, owner: user }]);
    setTasks({ ...tasks, [newProject]: [] });
    setNewProject('');
  };

  const addTask = (project, task, priority, dueDate) => {
    if (task.trim() === '') return;
    setTasks({
      ...tasks,
      [project]: [...tasks[project], { name: task, status: 'Not Started', priority, dueDate }]
    });
  };

  const updateTaskStatus = (project, index) => {
    const updatedTasks = tasks[project].map((task, i) => {
      if (i === index) {
        const nextStatus = task.status === 'Not Started' ? 'In Progress' : task.status === 'In Progress' ? 'Completed' : 'Not Started';
        return { ...task, status: nextStatus };
      }
      return task;
    });
    setTasks({ ...tasks, [project]: updatedTasks });
  };

  const getReportData = () => {
    let totalTasks = 0;
    let completedTasks = 0;
    let inProgressTasks = 0;
    let notStartedTasks = 0;

    Object.values(tasks).forEach(taskList => {
      taskList.forEach(task => {
        totalTasks++;
        if (task.status === 'Completed') completedTasks++;
        else if (task.status === 'In Progress') inProgressTasks++;
        else if (task.status === 'Not Started') notStartedTasks++;
      });
    });

    return { totalProjects: projects.length, totalTasks, completedTasks, inProgressTasks, notStartedTasks };
  };

  const downloadCSV = () => {
    const report = getReportData();
    const csvContent = `Total Projects,Total Tasks,Completed Tasks,Tasks In Progress,Tasks Not Started\n${report.totalProjects},${report.totalTasks},${report.completedTasks},${report.inProgressTasks},${report.notStartedTasks}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'project_report.csv';
    link.click();
  };

  if (!loggedIn) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px' }}>
          <h1>Login</h1>
          <input
            placeholder="Enter your username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
          />
          <button onClick={handleLogin} style={{ padding: '8px 16px' }}>Login</button>
        </div>
      </div>
    );
  }

  const report = getReportData();

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1>{user}'s Project To-Do List</h1>
          <button onClick={handleLogout} style={{ padding: '8px 16px' }}>Logout</button>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <input
            placeholder="Add New Project"
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            style={{ padding: '8px', marginRight: '10px', width: '60%' }}
          />
          <button onClick={addProject} style={{ padding: '8px 16px' }}>Add Project</button>
          <button onClick={() => setReportVisible(!reportVisible)} style={{ padding: '8px 16px', marginLeft: '10px' }}>View Report</button>
        </div>

        {reportVisible && (
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
            <h2>Project Report</h2>
            <p>Total Projects: {report.totalProjects}</p>
            <p>Total Tasks: {report.totalTasks}</p>
            <p>Completed Tasks: {report.completedTasks}</p>
            <p>Tasks In Progress: {report.inProgressTasks}</p>
            <p>Tasks Not Started: {report.notStartedTasks}</p>
            <button onClick={downloadCSV} style={{ padding: '8px 16px', marginRight: '10px' }}>Download CSV</button>
            <button onClick={() => window.print()} style={{ padding: '8px 16px' }}>Print Report</button>
          </div>
        )}

        {projects
          .filter((project) => project.owner === user)
          .map((project, idx) => (
            <div key={idx} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
              <h2>{project.name}</h2>
              <TaskList project={project.name} tasks={tasks[project.name]} addTask={addTask} updateTaskStatus={updateTaskStatus} />
            </div>
          ))}
      </div>
    </div>
  );
}

function TaskList({ project, tasks, addTask, updateTaskStatus }) {
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <input
          placeholder="Add New Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', width: '30%' }}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ padding: '8px', marginRight: '10px' }}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button onClick={() => { addTask(project, newTask, priority, dueDate); setNewTask(''); setDueDate(''); }} style={{ padding: '8px 16px' }}>Add Task</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task, idx) => (
          <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', border: '1px solid #eee', borderRadius: '4px', marginBottom: '10px' }}>
            <div>
              <span>{task.name} - <strong>{task.status}</strong></span><br />
              <small>Priority: {task.priority} | Due: {task.dueDate}</small>
            </div>
            <button onClick={() => updateTaskStatus(project, idx)} style={{ padding: '6px 12px' }}>Change Status</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
