import express from "express";
import { Student, User } from "../../models";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      student?: Student;
    }
  }
}
