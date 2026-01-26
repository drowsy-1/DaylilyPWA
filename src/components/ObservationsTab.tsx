import { useState, useEffect, useRef, useCallback } from 'react';
import './ObservationsTab.css';
import type { TodoItem } from '../types';

interface ObservationsTabProps {
  onNavigate: (page: 'add-note' | 'add-plant' | 'continue-variety' | 'continue-seedling' | 'continue-seedling-group') => void;
}

const STORAGE_KEY = 'daylily-todos';
const COMPLETED_REMOVAL_DELAY = 10 * 60 * 1000; // 10 minutes in milliseconds

function ObservationsTab({ onNavigate }: ObservationsTabProps) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [newTodoText, setNewTodoText] = useState('');
  const [isYearly, setIsYearly] = useState(false);
  const [yearlyDates, setYearlyDates] = useState<string[]>(['']);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load todos from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as TodoItem[];
        // Filter out completed items older than 10 minutes
        const now = Date.now();
        const filtered = parsed.filter(todo => {
          if (todo.completed && todo.completedAt) {
            const completedTime = new Date(todo.completedAt).getTime();
            return now - completedTime < COMPLETED_REMOVAL_DELAY;
          }
          return true;
        });
        setTodos(filtered);
      } catch {
        setTodos([]);
      }
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // Set up interval to remove completed items after 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTodos(prev => prev.filter(todo => {
        if (todo.completed && todo.completedAt) {
          const completedTime = new Date(todo.completedAt).getTime();
          return now - completedTime < COMPLETED_REMOVAL_DELAY;
        }
        return true;
      }));
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Create audio context for ding sound
  const playDing = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 880; // A5 note
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch {
      // Audio not supported, fail silently
    }
  }, []);

  const handleToggleComplete = (id: string) => {
    setTodos(prev => {
      const updated = prev.map(todo => {
        if (todo.id === id) {
          const nowCompleted = !todo.completed;
          if (nowCompleted) {
            playDing();
            return { ...todo, completed: true, completedAt: new Date().toISOString() };
          } else {
            return { ...todo, completed: false, completedAt: undefined };
          }
        }
        return todo;
      });

      // Sort: incomplete items first, then completed items
      return updated.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });
    });
  };

  const handleOpenModal = (todo?: TodoItem) => {
    if (todo) {
      setEditingTodo(todo);
      setNewTodoText(todo.text);
      setIsYearly(todo.isYearly);
      setYearlyDates(todo.yearlyDates?.length ? todo.yearlyDates : ['']);
    } else {
      setEditingTodo(null);
      setNewTodoText('');
      setIsYearly(false);
      setYearlyDates(['']);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
    setNewTodoText('');
    setIsYearly(false);
    setYearlyDates(['']);
  };

  const handleSaveTodo = () => {
    if (!newTodoText.trim()) return;

    const filteredDates = yearlyDates.filter(d => d.trim() !== '');

    if (editingTodo) {
      // Update existing todo
      setTodos(prev => prev.map(todo =>
        todo.id === editingTodo.id
          ? {
              ...todo,
              text: newTodoText.trim(),
              isYearly,
              yearlyDates: isYearly ? filteredDates : undefined,
            }
          : todo
      ));
    } else {
      // Add new todo
      const newTodo: TodoItem = {
        id: crypto.randomUUID(),
        text: newTodoText.trim(),
        completed: false,
        isYearly,
        yearlyDates: isYearly ? filteredDates : undefined,
        createdAt: new Date().toISOString(),
      };
      setTodos(prev => [newTodo, ...prev]);
    }

    handleCloseModal();
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    handleCloseModal();
  };

  const handleAddDateField = () => {
    setYearlyDates(prev => [...prev, '']);
  };

  const handleRemoveDateField = (index: number) => {
    setYearlyDates(prev => prev.filter((_, i) => i !== index));
  };

  const handleDateChange = (index: number, value: string) => {
    setYearlyDates(prev => prev.map((d, i) => i === index ? value : d));
  };

  const formatYearlyDate = (mmdd: string) => {
    if (!mmdd) return '';
    const [month, day] = mmdd.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(month, 10) - 1;
    return `${monthNames[monthIndex] || month} ${parseInt(day, 10)}`;
  };

  return (
    <div className="observations-tab">
      <div className="action-buttons">
        <button className="action-btn" onClick={() => onNavigate('add-plant')}>
          <span className="btn-icon">+</span>
          Add Seedling / Variety
        </button>
        <button className="action-btn" onClick={() => onNavigate('continue-variety')}>
          <span className="btn-icon">→</span>
          Continue Variety Observation
        </button>
        <button className="action-btn" onClick={() => onNavigate('continue-seedling')}>
          <span className="btn-icon">→</span>
          Continue Seedling Observation
        </button>
        <button className="action-btn" onClick={() => onNavigate('continue-seedling-group')}>
          <span className="btn-icon">→</span>
          Continue Seedling Group Observation
        </button>
        <button className="action-btn" onClick={() => onNavigate('add-note')}>
          <span className="btn-icon">+</span>
          Add Notes
        </button>
      </div>

      {/* To Do Section - Now on top */}
      <section className="todo-section">
        <div className="section-header">
          <h2>To Do:</h2>
          <button className="add-todo-btn" onClick={() => handleOpenModal()} aria-label="Add todo">
            +
          </button>
        </div>
        <div className="todo-list">
          {todos.length === 0 ? (
            <p className="empty-message">No tasks yet. Click + to add one.</p>
          ) : (
            todos.map(todo => (
              <div
                key={todo.id}
                className={`todo-item ${todo.completed ? 'todo-completed' : ''}`}
              >
                <label className="todo-checkbox-label">
                  <input
                    type="checkbox"
                    className="todo-checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.id)}
                  />
                  <span className="todo-checkmark"></span>
                </label>
                <div className="todo-content" onClick={() => handleOpenModal(todo)}>
                  <span className="todo-text">{todo.text}</span>
                  {todo.isYearly && todo.yearlyDates && todo.yearlyDates.length > 0 && (
                    <span className="todo-yearly-badge">
                      Yearly: {todo.yearlyDates.map(formatYearlyDate).join(', ')}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Recent Activity Section - Now on bottom */}
      <section className="activity-section">
        <h2>Recent Activity:</h2>
        <div className="activity-list">
          {/* Activity items will go here */}
        </div>
      </section>

      {/* Todo Modal */}
      {isModalOpen && (
        <div className="todo-modal-overlay" onClick={handleCloseModal}>
          <div className="todo-modal" onClick={e => e.stopPropagation()}>
            <div className="todo-modal-header">
              <h3>{editingTodo ? 'Edit Task' : 'Add Task'}</h3>
              <button className="todo-modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <div className="todo-modal-body">
              <div className="todo-form-group">
                <label className="todo-form-label">Task</label>
                <input
                  type="text"
                  className="todo-form-input"
                  placeholder="Enter task description..."
                  value={newTodoText}
                  onChange={e => setNewTodoText(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="todo-form-group">
                <label className="todo-yearly-toggle">
                  <input
                    type="checkbox"
                    checked={isYearly}
                    onChange={e => setIsYearly(e.target.checked)}
                  />
                  <span>Repeat yearly</span>
                </label>
              </div>

              {isYearly && (
                <div className="todo-form-group">
                  <label className="todo-form-label">Yearly Date(s)</label>
                  <div className="yearly-dates-list">
                    {yearlyDates.map((date, index) => (
                      <div key={index} className="yearly-date-row">
                        <input
                          type="date"
                          className="todo-form-input date-input"
                          value={date ? `2024-${date}` : ''}
                          onChange={e => {
                            const val = e.target.value;
                            if (val) {
                              const mmdd = val.slice(5); // Remove year, keep MM-DD
                              handleDateChange(index, mmdd);
                            } else {
                              handleDateChange(index, '');
                            }
                          }}
                        />
                        {yearlyDates.length > 1 && (
                          <button
                            type="button"
                            className="remove-date-btn"
                            onClick={() => handleRemoveDateField(index)}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="add-date-btn"
                      onClick={handleAddDateField}
                    >
                      + Add another date
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="todo-modal-footer">
              {editingTodo && (
                <button
                  className="todo-delete-btn"
                  onClick={() => handleDeleteTodo(editingTodo.id)}
                >
                  Delete
                </button>
              )}
              <div className="todo-modal-actions">
                <button className="todo-cancel-btn" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button
                  className="todo-save-btn"
                  onClick={handleSaveTodo}
                  disabled={!newTodoText.trim()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden audio element for fallback */}
      <audio ref={audioRef} preload="auto" />
    </div>
  );
}

export default ObservationsTab;
