import { Service } from '@pet/PetInterface'
import { Attachment } from '@utils/types'
import { Task } from 'features/task/taskInterface'

export interface Event {
  pets: string[]
  date: string
  time: string | null
  tag: string 
  status: 'upcoming' | 'completed' | 'canceled'
  task: string | Task
  service: string | Service
  attachments: string[] | Attachment[]
  notes: string | null
}
