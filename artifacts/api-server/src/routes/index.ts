import { Router, type IRouter } from "express";
import healthRouter from "./health";
import roadsRouter from "./roads";
import complaintsRouter from "./complaints";
import sensorsRouter from "./sensors";
import spendingRouter from "./spending";
import contractorsRouter from "./contractors";
import aiRouter from "./ai";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(aiRouter);
router.use(roadsRouter);
router.use(complaintsRouter);
router.use(sensorsRouter);
router.use(spendingRouter);
router.use(contractorsRouter);

export default router;
