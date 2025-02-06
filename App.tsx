import React, { useState, useEffect } from 'react';
import { 
  Home, 
  FileText, 
  Inbox, 
  BarChart2, 
  Folder, 
  Target, 
  Plus, 
  Search,
  ChevronLeft,
  Play,
  Pause,
  Square,
  Clock,
  CheckCircle2,
  Timer,
  ClipboardList,
  BarChart,
  Mail,
  Menu
} from 'lucide-react';
import type { Task, Session, View } from './types';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentDate] = useState(new Date());
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentSession, setCurrentSession] = useState<Omit<Session, 'endTime' | 'duration'> | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<View>('home');

  useEffect(() => {
    const savedSessions = localStorage.getItem('sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    let interval: number | null = null;
    if (isRunning) {
      interval = window.setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startSession = () => {
    setIsRunning(true);
    setCurrentSession({
      id: crypto.randomUUID(),
      startTime: new Date().toISOString(),
      tasks: []
    });
  };

  const pauseSession = () => {
    setIsRunning(false);
  };

  const endSession = () => {
    if (currentSession) {
      const endTime = new Date().toISOString();
      const newSession: Session = {
        ...currentSession,
        endTime,
        duration: time,
        tasks: [...tasks]
      };
      setSessions((prev) => [...prev, newSession]);
      setCurrentSession(null);
      setIsRunning(false);
      setTime(0);
      setTasks([]);
    }
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      const task: Task = {
        id: crypto.randomUUID(),
        title: newTask,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTasks((prev) => [...prev, task]);
      setNewTask('');
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            {/* Timer Section */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl p-8">
                <div className="max-w-2xl mx-auto">
                  <div className="flex flex-col items-center">
                    <h3 className="text-xl text-white mb-6">Session Timer</h3>
                    <div className="text-7xl font-light text-white mb-8 tabular-nums">
                      {formatTime(time)}
                    </div>
                    <div className="flex justify-center gap-6">
                      {!isRunning && !currentSession && (
                        <button
                          onClick={startSession}
                          className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
                        >
                          <Play className="w-8 h-8 text-white" />
                        </button>
                      )}
                      {isRunning && (
                        <button
                          onClick={pauseSession}
                          className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
                        >
                          <Pause className="w-8 h-8 text-white" />
                        </button>
                      )}
                      {currentSession && (
                        <button
                          onClick={endSession}
                          className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
                        >
                          <Square className="w-8 h-8 text-white" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Tasks Section */}
              <div className="lg:col-span-8">
                <div className="mb-6">
                  <h2 className="text-xl font-medium flex items-center gap-2">
                    <span className="inline-block w-5 h-5 bg-yellow-500 rounded-sm"></span>
                    Current Session Tasks
                  </h2>
                </div>
                <form onSubmit={addTask} className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      placeholder="Add a new task..."
                      className="flex-1 rounded-lg border border-gray-200 px-4 py-2"
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Add Task
                    </button>
                  </div>
                </form>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 group">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-1 w-4 h-4 rounded-sm flex items-center justify-center ${
                          task.completed
                            ? 'bg-blue-500'
                            : 'border-2 border-gray-300'
                        }`}
                      >
                        {task.completed && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12">
                            <path
                              fill="currentColor"
                              d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
                            />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={task.completed ? 'line-through text-gray-400' : ''}>
                            {task.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session Stats */}
              <div className="lg:col-span-4">
                <div className="bg-gray-900 rounded-2xl p-6">
                  <h3 className="text-lg text-white mb-6">Session Stats</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-400">Total Sessions</div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl text-white">{sessions.length}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Tasks Completed</div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl text-white">
                          {tasks.filter((t) => t.completed).length}
                        </span>
                        <span className="text-gray-400">/{tasks.length}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Current Session</div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl text-white">{formatTime(time)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'tasks':
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-medium mb-6">All Tasks</h2>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-4 h-4 rounded-sm flex items-center justify-center ${
                      task.completed ? 'bg-blue-500' : 'border-2 border-gray-300'
                    }`}
                  >
                    {task.completed && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12">
                        <path
                          fill="currentColor"
                          d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
                        />
                      </svg>
                    )}
                  </button>
                  <span className={task.completed ? 'line-through text-gray-400' : ''}>
                    {task.title}
                  </span>
                  <span className="text-sm text-gray-400 ml-auto">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'reporting':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-medium mb-6">Session Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Total Time</h3>
                  <p className="text-3xl font-light">
                    {formatTime(sessions.reduce((acc, session) => acc + session.duration, 0))}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Sessions</h3>
                  <p className="text-3xl font-light">{sessions.length}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Tasks Completed</h3>
                  <p className="text-3xl font-light">
                    {sessions.reduce((acc, session) => 
                      acc + session.tasks.filter(t => t.completed).length, 0
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-medium mb-6">Recent Sessions</h2>
              <div className="space-y-4">
                {sessions.slice(-5).reverse().map((session) => (
                  <div key={session.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">
                          {new Date(session.startTime).toLocaleDateString()} - {formatTime(session.duration)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-gray-600">
                          {session.tasks.filter((t) => t.completed).length}/{session.tasks.length} Tasks
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-medium mb-4">Coming Soon</h2>
            <p className="text-gray-600">This feature is under development.</p>
          </div>
        );
    }
  };

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Focus Flow
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Enhance your productivity with intelligent session tracking and task management. 
              Focus Flow helps you maintain momentum and achieve more in less time.
            </p>
            <button 
              onClick={() => setShowIntro(false)}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Start Your Session
            </button>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Timer className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Session Timer</h3>
              <p className="text-gray-600">
                Track your work sessions with precision using our intuitive stopwatch timer. 
                Stay focused and maintain productive work intervals.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <ClipboardList className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Task Logging</h3>
              <p className="text-gray-600">
                Record and track completed tasks during each session. 
                Keep a clear record of your accomplishments and progress.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Session Analytics</h3>
              <p className="text-gray-600">
                Gain insights from your session history and task completion patterns. 
                Make data-driven decisions to optimize your productivity.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-500">
                  © 2025 Focus Flow. All Rights Reserved.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href="mailto:vikastg2000@gmail.com" className="text-sm text-gray-500 hover:text-orange-600">
                    vikastg2000@gmail.com
                  </a>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  'Focus Flow' and all associated features, design, and content are the intellectual property of Vikas T G.
                  Unauthorized reproduction, modification, or distribution of this application or its assets is strictly prohibited.
                  Protected under applicable copyright laws.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md"
      >
        <Menu className="w-6 h-6 text-gray-600" />
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 p-4
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <span className="text-xl font-semibold">Focus Flow</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <button className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-left mb-6 hover:bg-gray-50">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Create</span>
          </div>
        </button>

        <div className="space-y-6">
          <div>
            <div className="text-xs font-medium text-gray-400 mb-2">GENERAL</div>
            <nav className="space-y-1">
              <button 
                onClick={() => setCurrentView('home')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 ${
                  currentView === 'home' ? 'bg-gray-100 text-blue-600' : 'text-gray-700'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <button 
                onClick={() => setCurrentView('tasks')}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 ${
                  currentView === 'tasks' ? 'bg-gray-100 text-blue-600' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4" />
                  <span>My Tasks</span>
                </div>
                <span className="text-sm text-gray-400">{tasks.length}</span>
              </button>
              <button 
                onClick={() => setCurrentView('inbox')}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 ${
                  currentView === 'inbox' ? 'bg-gray-100 text-blue-600' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Inbox className="w-4 h-4" />
                  <span>Inbox</span>
                </div>
                <span className="text-sm text-gray-400">0</span>
              </button>
              <button 
                onClick={() => setCurrentView('reporting')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 ${
                  currentView === 'reporting' ? 'bg-gray-100 text-blue-600' : 'text-gray-700'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>Reporting</span>
              </button>
              <button 
                onClick={() => setCurrentView('portfolios')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 ${
                  currentView === 'portfolios' ? 'bg-gray-100 text-blue-600' : 'text-gray-700'
                }`}
              >
                <Folder className="w-4 h-4" />
                <span>Portfolios</span>
              </button>
              <button 
                onClick={() => setCurrentView('goals')}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 ${
                  currentView === 'goals' ? 'bg-gray-100 text-blue-600' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Target className="w-4 h-4" />
                  <span>Goals</span>
                </div>
                <span className="text-sm text-gray-400">0</span>
              </button>
            </nav>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-gray-400">MY WORKSPACE</div>
              <button className="text-gray-400 hover:text-gray-600">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <nav className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                <div className="w-4 h-4 bg-red-100 rounded-lg"></div>
                <span>Branding and Identity...</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                <div className="w-4 h-4 bg-purple-100 rounded-lg"></div>
                <span>Marketing Team</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                <div className="w-4 h-4 bg-yellow-100 rounded-lg"></div>
                <span>Product launch</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                <div className="w-4 h-4 bg-green-100 rounded-lg"></div>
                <span>Team brainstorm</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 lg:pl-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <ChevronLeft className="w-5 h-5 text-gray-400" />
            <div className="flex items-center gap-2">
              <span className="text-gray-400">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Search className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <h1 className="text-4xl font-light text-gray-400 mb-8">
          Focus Flow
        </h1>

        {renderView()}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-gray-500">
                © 2025 Focus Flow. All Rights Reserved.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href="mailto:vikastg2000@gmail.com" className="text-sm text-gray-500 hover:text-orange-600">
                  vikastg2000@gmail.com
                </a>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                'Focus Flow' and all associated features, design, and content are the intellectual property of Vikas T G.
                Unauthorized reproduction, modification, or distribution of this application or its assets is strictly prohibited.
                Protected under applicable copyright laws.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
