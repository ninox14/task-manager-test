import { TaskPage } from './features/tasks/TaskPage';

function App() {
  return (
    <div className="bg-gray-950 p-3 w-full min-h-svh flex flex-col items-center text-slate-300 ">
      <h1 className="font-bold text-4xl">TOdo</h1>
      <TaskPage />
    </div>
  );
}

export default App;
