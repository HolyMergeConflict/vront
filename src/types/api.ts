export type ID = number | string;

export enum UserRole {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
}

export enum TaskStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}


// Backend may return any string for solution status; keep it flexible
export type TaskSolutionStatus = string;


export interface UserPublic {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}


export interface TaskBase {
  id: number;
  title: string;
  description: string;
  answer?: string;
  difficulty: number;
  subject: string;
  status: TaskStatus;
  creator_id: number;
  created_at?: string;
  updated_at?: string;
}


export interface TaskOut extends TaskBase {
// if backend enriches with relations, keep optional
  creator?: UserPublic;
}


export interface TaskCreate {
  title: string;
  description: string;
  answer: string;
  difficulty: number;
  subject: string;
}


export type TaskUpdate = Partial<Pick<TaskCreate, "title" | "description" | "answer" | "difficulty" | "subject">> & {
  status?: TaskStatus;
};


export interface TaskHistoryRow {
  id: number;
  user_id: number;
  task_id: number;
  status: TaskSolutionStatus;
  timestamp: string;
  answer: string;
  score: number;
  feedback?: string | null;
  user?: UserPublic;
  task?: TaskBase;
}

