import { Class } from '../models/class.model';

export class ClassService {

    async getAllClass() {
        const classData = await Class.find({ isActive: true });

        const classDto = classData.map(c => c.toDTO());
        return classDto;
    }

    async getClassById(classId: string) {
        return await Class.findById(classId);
    }
}