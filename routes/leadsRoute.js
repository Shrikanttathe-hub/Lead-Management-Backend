const express = require('express');
const { subAdmin } = require('../models/subAdmin.model');
const { Leads } = require('../models/leads.model');
const Auth = require('../middleware/authMiddleWare');
const isSuperAdmin = require("../middleware/roleMiddleWare");
const router = express.Router();

router.post('/create',Auth, async (req, res)=> {
    try{
      const { assignedModel, name, email, phoneNumber, status, source, tags, assigned, note } = req.body;
      if(!name || !email || !phoneNumber || !status || !source) return res.status(400).json({status:false, message: "Required fields missing"});
      const newLead = new Leads({name, email, phoneNumber, status, source, tags, assigned: assigned || null,   assignedModel: assigned ? assignedModel : null, notes: note ? [{ message: note, adminId: req.user.id }] : [] });
      await  newLead.save(); 
      res.status(201).json({status: true, messsage: "Lead created successfully!", data: newLead});
    }catch(error){
        console.log("error", error);
        res.status(500).json({status: false, messsage:  error.message || "Something went wrong",});
    }
});

router.get('/lead-list', Auth,  async(req, res) => {
    try{
      const leads = await Leads.find().populate("assigned", "firstName lastName email").sort({createdAt: -1});
     res.status(200).json({staus:true, message: "Leads find", data: leads});
    }catch(error){
        console.log("error", error);
        res.status(400).json({status:false, message: error.message || "Something went wrong"})
    }
});

router.get('/lead-single/:id', Auth,  async(req,res)=> {
   try{
     const lead = await Leads.findById(req.params.id).populate("assigned");
     res.status(200).json({status: true, message: "Lead find", data: lead});
   }catch(error){
    res.status(400).json({status: false, message: error.message || "Something went wrong"});
   }
});

router.put("/lead-single/:id", Auth, async (req, res) => {
  try {
    const { note, assigned, assignedModel, ...updateData } = req.body;
    const updatedLead = await Leads.findByIdAndUpdate(req.params.id, {...updateData, assigned, assignedModel},{ new: true, runValidators: true });
    if (note) {
      updatedLead.notes.push({
        message: note,
        adminId: req.user.id,
      });
      await updatedLead.save();
    }
    res.status(200).json({ success: true, message: "Lead updated Successfully!", data: updatedLead });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/lead-single/:id", Auth, isSuperAdmin, async (req, res) => {
  try {
    await Leads.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Lead deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/add-tag/:id", Auth, async (req, res) => {
  try {
    const { tag } = req.body;
    if (!tag) return res.status(400).json({ message: "Tag is required" });
    const lead = await Leads.findById(req.params.id);
    if(!lead) return res.status(404).json({ message: "Lead not found" });
    if (!lead.tags) lead.tags = [];
    const isTagExists = lead.tags.includes(tag);
    if (isTagExists) return res.status(400).json({ message: "Tag already exists" });
    lead.tags.push(tag);
    await lead.save();
    res.status(200).json({ success: true, message: "Tag added successfully", data: lead});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/update-tag/:id", Auth, async (req, res) => {
  try {
    const { oldTag, newTag } = req.body;
    const lead = await Leads.findById(req.params.id);
    const index = lead.tags.indexOf(oldTag);
    if (index === -1) return res.status(404).json({ message: "Tag not found" });
    lead.tags[index] = newTag;
    await lead.save();
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete("/add-tag/:id", Auth, async (req, res) => {
  try {
    const { tag } = req.body;
    const lead = await Leads.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    lead.tags = lead.tags.filter(t => t !== tag);
    await lead.save();
    res.status(200).json({success: true, message: "Tag deleted successfully",data: lead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;