import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../../models/user.model';
import { Class } from '../../models/class.model';
import { Reservation } from '../../models/reservation.model';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gymbook');
        console.log('Conectado a MongoDB...');

        // Limpieza total (Drop de colecciones)
        await User.deleteMany({});
        await Class.deleteMany({});
        await Reservation.deleteMany({});
        console.log('Colecciones limpias.');


        // Creamos datos iniciales (DML)
        const admin = new User({ 
            name: 'Admin', 
            email: 'admin@gym.com', 
            password: 'password123', 
            role: 'admin' 
        });
        await admin.save(); 

        const client1 = new User({ 
            name: 'Cristina Garcia', 
            email: 'cgarcia@gym.com', 
            password: 'password1111', 
            role: 'client' 
        });
        await client1.save();

        const client2 = new User({ 
            name: 'Ann Sanchez', 
            email: 'asanchez@gym.com', 
            password: 'password2222', 
            role: 'client' 
        });
        await client2.save();
        
        const client3 = new User({ 
            name: 'Belen Paez', 
            email: 'bpaez@gym.com', 
            password: 'password3333', 
            role: 'client' 
        });
        await client3.save();

        const gymClass1 = await Class.create({
            name: 'Yoga Matutino',
            instructor: 'Jose Hernandez',
            date: new Date(),
            totalCapacity: 20,
            availableCapacity: 20,
            isActive: true
        });

        const gymClass2 = await Class.create({
            name: 'Yoga Nocturno',
            instructor: 'Pedro Aguilar',
            date: new Date(),            
            totalCapacity: 20,
            availableCapacity: 20,
            isActive: true
        });

        const gymClass3 = await Class.create({
            name: 'Spinnig Matutino',
            instructor: 'Jairo Orellana',
            date: new Date(),            
            totalCapacity: 15,
            availableCapacity:15,
            isActive: true
        });

        const gymClass4 = await Class.create({
            name: 'Spinnig Nocturno',
            instructor: 'Maria Campos',
            date: new Date(),            
            totalCapacity: 15,
            availableCapacity: 15,
            isActive: true
        });

        console.log('--- Base de datos inicializada ---');
        console.log('Usuario:', admin.email);
        console.log('Usuario:', client1.email);
        console.log('Usuario:', client2.email);
        console.log('Usuario:', client3.email);
        console.log('Clase:', gymClass1.name);
        console.log('Clase:', gymClass2.name);
        console.log('Clase:', gymClass3.name);
        console.log('Clase:', gymClass4.name);

        process.exit(0);
    } catch (error) {
        console.error('Error durante el seeding:', error);
        process.exit(1);
    }
};

seed();