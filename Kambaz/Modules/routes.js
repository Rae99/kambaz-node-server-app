import * as modulesDao from "./dao.js";

export default function ModuleRoutes(app) {
  const deleteModule = async (req, res) => {
    const { moduleId } = req.params;
    const status = await modulesDao.deleteModule(moduleId);
    res.send(status);
  }
    
  app.delete("/api/modules/:moduleId", deleteModule);
}
