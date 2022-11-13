import { Controller, Get, Post, Body, Param , Delete, Patch, Query, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dto/createTask.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TaskStatus } from "./tasks-status.enum";
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterData:GetTasksFilterDto): Promise<Task[]> {
    return this.tasksService.getTasks(filterData)
  }


  @Get("/:id")
  getTaskById(@Param('id') taskId: string): Promise<Task> {
    return this.tasksService.getTaskById(taskId);
  }



  // @Get("/:id")
  // getTaskById(@Param('id') taskId: string): Task {
  //   return this.tasksService.getTaskByID(taskId);
  // }


  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto)
  }


  // @Post()
  // createTask(@Body() createTaskDto: CreateTaskDto): Task {
  //   return this.tasksService.createTask(createTaskDto)
  // }

  @Delete("/:id")
  deleteTask(@Param('id') taskId: string): Promise<void> {
    return this.tasksService.deleteTask(taskId);
  }

  @Patch("/:id/status")
  updateTaskStatus(
    @Param('id') id:string,
    @Body() updateTaskStatusDto:UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTask(id, status);
  }
}
