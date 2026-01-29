import React from "react";
import { Provider } from "react-redux";
import TodoList from "./components/TodoList";
import { store } from "./store/store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="glass-card p-8 rounded-3xl shadow-2xl mx-auto max-w-md">
              <h1 className="text-5xl font-black bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                🧾 TodoMaster
              </h1>
              <p className="text-xl text-white/80 font-light">
                Управляй задачами с удовольствием ✨
              </p>
            </div>
          </div>
          <TodoList />
        </div>
      </div>
    </Provider>
  );
};

export default App;
