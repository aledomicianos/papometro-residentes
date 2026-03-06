import { Router } from 'express';
import { residentController } from '../controllers/residentController';
import { surgeryController }  from '../controllers/surgeryController';
import { patientController }  from '../controllers/patientController';

const router = Router();

// Residents
router.get   ('/residents',     residentController.list);
router.post  ('/residents',     residentController.create);
router.put   ('/residents/:id', residentController.update);
router.delete('/residents/:id', residentController.remove);

// Surgeries
router.get   ('/surgeries',     surgeryController.list);
router.post  ('/surgeries',     surgeryController.create);
router.delete('/surgeries/:id', surgeryController.remove);

// Patients
router.get   ('/patients',      patientController.list);
router.post  ('/patients',      patientController.create);
router.put   ('/patients/:id',  patientController.update);
router.delete('/patients/:id',  patientController.remove);

export default router;
