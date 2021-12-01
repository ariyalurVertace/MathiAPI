//PREDEFINED

import userRouter from "./predefined/user_router.js";
import roleRouter from "./predefined/role_router.js";
import apiModuleRouter from "./predefined/api_module_router.js";
import apiModuleParameterRouter from "./predefined/api_module_parameter_router.js";
import uiModuleRouter from "./predefined/ui_module_router.js";
import uiModuleComponentRouter from "./predefined/ui_module_component_router.js";
import userRoleRouter from "./predefined/user_role_router.js";
import apiModuleRoleAccessRouter from "./predefined/api_module_role_access_router.js";
import uiModuleRoleAccessRouter from "./predefined/ui_module_role_access_router.js";
import uiModuleComponentRoleAccessRouter from "./predefined/ui_module_component_role_access_router.js";
import cronScheduleRouter from "./predefined/cron_schedule_router.js";
import uploadFilesRouter from "./predefined/fileupload_router.js";
// import {userResolver} from "../controllers/predefined/user_controller.js";

//CUSTOM

import sellerProfileRouter from "./custom/sellerProfile_router.js";
import categoryRouter from "./custom/category_router.js";
import cartRouter from "./custom/cart_router.js";
import favouriteRouter from "./custom/favourite_router.js";
import addressRouter from "./custom/address_router.js";
import customerProfileRouter from "./custom/customerProfile_router.js";
import districtRouter from "./custom/district_router.js";
import stateRouter from "./custom/state_router.js";
import productReviewRouter from "./custom/productReview_router.js";

export default function exportedRouter(app) {
    app.use("/api/user", userRouter());
    app.use("/api/role", roleRouter());
    app.use("/api/apimodule", apiModuleRouter());
    app.use("/api/apimoduleparameter", apiModuleParameterRouter());
    app.use("/api/uimodule", uiModuleRouter());
    app.use("/api/uimodulecomponent", uiModuleComponentRouter());
    app.use("/api/userrole", userRoleRouter());
    app.use("/api/apimoduleroleaccess", apiModuleRoleAccessRouter());
    app.use("/api/uimoduleroleaccess", uiModuleRoleAccessRouter());
    app.use(
        "/api/uimodulecomponentroleaccess",
        uiModuleComponentRoleAccessRouter(),
    );
    app.use("/api/cronschedule", cronScheduleRouter());

    app.use("/api/sellerProfile", sellerProfileRouter());
    app.use("/api/category", categoryRouter());
    app.use("/api/address", addressRouter());
    app.use("/api/customerProfile", customerProfileRouter());
    app.use("/api/fileupload", uploadFilesRouter());
    app.use("/api/district", districtRouter());
    app.use("/api/state", stateRouter());
    app.use("/api/cart", cartRouter());
    app.use("/api/favourite", favouriteRouter());
    app.use("/api/productReview", productReviewRouter());

    //NEW_REGISTER
}
