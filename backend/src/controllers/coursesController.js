const CourseService = require('../services/courseService');
const { validateRequest, courseSchemas } = require('../middleware/validation');

class CoursesController {
  constructor() {
    this.courseService = new CourseService();
  }

  getCourses = async (req, res) => {
    try {
      const { category, search } = req.query;
      
      let courses;
      if (search) {
        courses = await this.courseService.searchCourses(search);
      } else if (category) {
        courses = await this.courseService.getCoursesByCategory(category);
      } else {
        courses = await this.courseService.getAllCourses();
      }

      res.json({
        message: 'Cursos obtidos com sucesso',
        data: courses
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao buscar cursos'
      });
    }
  };

  getCourse = async (req, res) => {
    try {
      const { id } = req.params;
      const course = await this.courseService.getCourseById(id);
      
      if (!course) {
        return res.status(404).json({ message: 'Curso não encontrado' });
      }
      
      res.json({
        message: 'Curso obtido com sucesso',
        data: course
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao buscar curso'
      });
    }
  };

  createCourse = async (req, res) => {
    try {
      const courseData = req.body;
      const course = await this.courseService.createCourse(courseData);
      
      res.status(201).json({
        message: 'Curso criado com sucesso',
        data: course
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao criar curso'
      });
    }
  };

  updateCourse = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const course = await this.courseService.updateCourse(id, updateData);
      
      if (!course) {
        return res.status(404).json({ message: 'Curso não encontrado' });
      }
      
      res.json({
        message: 'Curso atualizado com sucesso',
        data: course
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao atualizar curso'
      });
    }
  };

  deleteCourse = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.courseService.deleteCourse(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Curso não encontrado' });
      }
      
      res.json({
        message: 'Curso excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao excluir curso'
      });
    }
  };
}

module.exports = CoursesController;
