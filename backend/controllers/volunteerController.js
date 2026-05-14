const Volunteer = require('../models/Volunteer');
const XLSX = require('xlsx');

// @desc    Export volunteers to Excel
// @route   GET /api/volunteers/export
// @access  Private
exports.exportVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    
    const data = volunteers.map(v => ({
      'Ism': v.fullName,
      'Telefon': v.phoneNumber,
      'Yosh': v.age,
      'Jins': v.gender,
      'Manzil': v.address,
      'Rol': v.role,
      'Holat': v.status,
      'Davomat': v.attendanceCount,
      'Qo\'shilgan sana': v.joinDate.toLocaleDateString(),
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Ko\'ngillilar');
    
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=volunteers.xlsx');
    res.send(buffer);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
// @route   GET /api/volunteers
// @access  Private
exports.getVolunteers = async (req, res) => {
  try {
    const { status, role, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (role) query.role = role;
    if (search) {
      query.fullName = { $regex: search, $options: 'i' };
    }

    const volunteers = await Volunteer.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: volunteers.length, data: volunteers });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single volunteer
// @route   GET /api/volunteers/:id
// @access  Private
exports.getVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ success: false, error: 'Volunteer not found' });
    }
    res.status(200).json({ success: true, data: volunteer });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create new volunteer
// @route   POST /api/volunteers
// @access  Private
exports.createVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.create(req.body);
    res.status(201).json({ success: true, data: volunteer });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update volunteer
// @route   PUT /api/volunteers/:id
// @access  Private
exports.updateVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!volunteer) {
      return res.status(404).json({ success: false, error: 'Volunteer not found' });
    }
    res.status(200).json({ success: true, data: volunteer });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete volunteer
// @route   DELETE /api/volunteers/:id
// @access  Private
exports.deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ success: false, error: 'Volunteer not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
