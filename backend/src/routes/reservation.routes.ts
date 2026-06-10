import { Router } from 'express';
import * as reservationController from '../controllers/reservation.controller';
import * as classController from '../controllers/class.controller';
import * as userController from '../controllers/user.controller';
import { validateCreateReservation } from '../middleware/validation/reservation.validator';
import { authMiddleware } from '../middleware/auth.middleware';
// import { authorize } from '../middleware/role.middleware';
import { sseEvents } from '../controllers/sse.controller';

const router = Router();

// endpoint de eventos
router.get('/classes/events', sseEvents);

router.use(authMiddleware);

// endpoints
router.get('/user/:userId', 
    reservationController.getByUserId
);

router.get('/users', 
    userController.getAllClients
);

router.get('/class', 
    classController.getAll
);

router.post('/', 
    validateCreateReservation, 
    reservationController.create
);

router.patch('/:reservationId/cancel',  
  reservationController.cancel
);

router.get('/', 
  reservationController.getAllReservations
);


export default router;