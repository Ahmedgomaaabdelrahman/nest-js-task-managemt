import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from "./tasks-status.enum";
import { CreateTaskDto } from './dto/createTask.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository : Repository<Task>,){}
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  // getTasksWithFilter(filterData: GetTasksFilterDto): Task[] {
  //     const {status, search} = filterData;

  //     let tasks = this.getAllTasks();
      
  //     if(status) {
  //       tasks = tasks.filter((task) => task.status === status)
  //     }

  //     if(search){ 
  //       tasks = tasks.filter((task) => {
  //         if(task.title.includes(search) || task.description.includes(search)){
  //           return true;
  //         }
          
  //         return false;
          
  //       })
  //     }

  //     return tasks;
  // }

  async getTasks(filterData: GetTasksFilterDto) : Promise<Task[]>{
    const { status, search} = filterData;
    const query = await this.tasksRepository.createQueryBuilder('task');
    
    if(status){
      query.andWhere('task.status = :status', {status});
    }

    if(search){
      query.andWhere('LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)' ,
      { search: `%${search}%`}
    )}
    const tasks = await query.getMany()
    return tasks;
  }
  async getTaskById(id:string) : Promise<Task>{
    const found = await this.tasksRepository.findOne({
      where: {
          id: id,
      },
    });
  
    if(!found){
      throw new NotFoundException("this task not found")
    }
    return found;
  }
  // getTaskByID(taskId: string): Task {
  //   const found = this.tasks.find((task) => task.id === taskId);
  //   if(!found) {
  //     throw new NotFoundException("this task not found")
  //   }
  //   return found;
  // }

  async createTask(createTaskDto: CreateTaskDto) : Promise<Task> {
    const { title , description } = createTaskDto;
    const createdTask = this.tasksRepository.create({
        title,
        description,
        status: TaskStatus.OPEN,
    });
    await this.tasksRepository.save(createdTask);
    return createdTask;
  }
  // createTask(createTaskDto: CreateTaskDto): Task{
  //   // using object destruction
  //   const { title , description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     description,
  //     title,
  //     status: TaskStatus.OPEN,
  //   };

  //   this.tasks.push(task);
  //   return task;
  // }

  async deleteTask(taskId: string): Promise<void> {
    const deleted = await this.tasksRepository.delete(taskId);
    if(deleted.affected === 0) {
      throw new NotFoundException(`Task with this Id not found`);
    }
  }

  // deleteTask(taskId: string): Task[] {
  //   const found = this.getTaskByID(taskId);
  //   this.tasks = this.tasks.filter((task) => task.id !== found.id);
  //   return this.tasks
  // }

  async updateTask(id: string, status:TaskStatus) {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}
