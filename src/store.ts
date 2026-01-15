import { configureStore } from '@reduxjs/toolkit';
import { tasksService } from '@/features/tasks/taskService';
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';

export const store = configureStore({
  reducer: {
    [tasksService.reducerPath]: tasksService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tasksService.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
