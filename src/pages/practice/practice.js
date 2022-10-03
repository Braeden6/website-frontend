import "./../resume/resume.css"
import NavBar from "../../components/navBar/navBar";
import { TemplateMap } from "../resume/resumeTemplates/templateMap";
import { Button, Form, Stack, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import TechSkillTemplateInput from "../resume/resumeTemplates/techSkillTemplateInput";
import TechSkillTemplate from "../resume/resumeTemplates/techSkillTemplate";
import ListTemplateInput from "../resume/resumeTemplates/listTemplateInput";

export default function Practice() {
  let initSectionBasic = {
    "title": "Sudoku Solver",
    "date": "Aug 2022 - Current",
    "list": ["Made a Sudoku solver app, in which you can use multiple different algorithms to solve sudoku puzzles to test and compare process speed",
        "Implemented solver with search tree, breadth-first search and depth-first search, and other heuristics to speed up process time",
        "Created a GUI with pyside6 that displays step-by-step solutions and allows you to solve puzzles yourself"],
    "technologies":    [ "Python", "Pyside6", "Pandas", "Numpy", "Github"] 
  }
  let initSectionSkill = {
    "sectionTitle": "Technical Skills",
    "templateType": "TechSkillTemplate",
    "subsections": [
        { 
            "title" : "Programming Languages",
            "list": ["C", "C++", "Java", "TypeScript", "Python", "JavaScript", "HTML", "CSS",
            "Visual Basic", "MATLAB", "R", "Julia", "JSX" ]
        },{
            "title" : "Technologies",
            "list": [ "IntelliJ", "Visual Studios", "Microsoft Office", "Azure", "Node.js",
            "React", "Bootstrap", "Serverless Computing", "Cosmos DB" ] 
        }]
}


  const Input = TemplateMap["BasicTemplateInput"]
  const Display = TemplateMap["BasicTemplate"]

  const [sectionBasic, changeSectionBasic] = useState(initSectionBasic)
  const [sectionSkill, changeSectionSkill] = useState(initSectionSkill)
  /*
  <Input section={sectionBasic} func={changeSectionBasic}></Input>
          <Display section={sectionBasic} ></Display>
  */

  useEffect(() => {
    //console.log(sectionSkill)
    
  }, [sectionSkill]);


  function changeSubsection (newSubsection, idx) {
    changeSectionSkill((prevState) => {
      var newList = [...prevState.subsections]
      newList[idx] = newSubsection
      return ({...prevState, subsections : newList })
    })
  }

  function removeSubsection(e) {
    changeSectionSkill((prevState) => {
      var newList = [...prevState.subsections]
      newList = newList.filter((item, index) => index !== parseInt(e.target.id))
      return ({...prevState, subsections : newList})
    })
  }

  function addSubsection() {
    changeSectionSkill( prevState => ({...prevState, 
    subsections: [...prevState.subsections, { "title":"", "list": []}]}))
  }

  function getList() {
    return (
      sectionSkill.subsections.map( (e,idx) => 
        <Stack className="ms-auto" direction="horizontal">
          <TechSkillTemplateInput id={idx.toString()} section={e} sections={sectionSkill.subsections} idx={idx} func={changeSubsection}/>
          <Button id={idx} onClick={removeSubsection}>remove</Button>
        </Stack>)
    )
  }

  let list = getList()


  return (
    <div id="all">
        <NavBar variant="light"/>
        <div id="resume">
          <ListTemplateInput/>




          {sectionSkill.subsections.map( (e,idx) =>
                  <TechSkillTemplate section={e}/>)}


        </div>
        
    </div>
  )
  }