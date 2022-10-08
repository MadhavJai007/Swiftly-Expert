import React, {useState, useEffect} from "react";
import ResetLessonDialog from "./UserPromptDialog";
import { v4 as uuidv4 } from 'uuid';
import {
    Box,
    Typography,
    Divider,
    TextField,
    Select,
    MenuItem,
    Button,
    IconButton,
    InputLabel,
    FormControl,
    List, 
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Checkbox,

  } from "@mui/material";
  import {RefreshOutlined as RefreshIcon, AddOutlined as AddIcon, RemoveCircleOutlined as RemoveIcon, DeleteOutline as DeleteIcon} from '@mui/icons-material';


  
  // playground editor component
  const PlaygroundEditor = (props) => {


    const updateSelectedChapter = () => {
        let clonedChapter = props.selectedChapter
        let questionsArray = clonedChapter.playground
        // questionsArray.push(question)
        let originalQuestion = questionsArray.find(question => question.id ==  props.selectedPlaygroundQuestion.id )
        let originalQuestionIndex = questionsArray.indexOf(originalQuestion)
        // console.log(questionsArray[originalQuestionIndex])

        // TODO: put all this in the selectedPlaygroundQuestion useEffect in dashboard.js
        // setTimeout(() => {
            console.log(props.selectedPlaygroundQuestion)
            questionsArray[originalQuestionIndex] = props.selectedPlaygroundQuestion
            console.log(questionsArray)
            props.setSelectedChapter({ ...clonedChapter, playground: questionsArray})
        // }, 2000)
        
    }

    const handleDeleteAction = () => {
        let clonedChapter = props.selectedChapter
        let questionsArray = clonedChapter.playground
        let originalQuestion = questionsArray.find(question => question.id ==  props.selectedPlaygroundQuestion.id )
        let originalQuestionIndex = questionsArray.indexOf(originalQuestion)
        props.setSelectedPlaygroundQuestion(null)
        props.deletePlaygroundQuestion(questionsArray[originalQuestionIndex].id)
        questionsArray.splice(originalQuestionIndex, 1)
        props.setSelectedChapter({ ...props.selectedChapter, playground: questionsArray})
    }

    // handler funciton when option's answer checkbox is checked
    const handleCheckBoxToggle = (value) => () => {
        const currentIndex = props.mcqChecked.indexOf(value);
        const newChecked = [...props.mcqChecked];
        

        if (currentIndex === -1) {
        newChecked.push(value);
        } else {
        newChecked.splice(currentIndex, 1);
        }

        let _mcq_answers = []; //  to hold updated answer list
        // update the mcq_answers list in the question object
        newChecked.forEach(answerIndex => {
            _mcq_answers.push(props.selectedPlaygroundQuestion.code_blocks[answerIndex])
        })
        console.log(_mcq_answers)
        props.setSelectedPlaygroundQuestion({...props.selectedPlaygroundQuestion, mcq_answers: _mcq_answers})
        // finally set the checked list so checkboxes are toggled
        props.setMcqChecked(newChecked);
        updateSelectedChapter()
        
    };

    // function to handle when add option in pressed
    const handleAddOption = (index) => {

        // update the mcq options list
        let _options =  props.selectedPlaygroundQuestion.code_blocks;
        _options.splice(index, 0, "New option")
        props.setSelectedPlaygroundQuestion({...props.selectedPlaygroundQuestion, code_blocks: _options })

        if(props.selectedPlaygroundQuestion.question_type == "mcq"){
            let _mcqChecked = props.mcqChecked // a copy
            let _mcq_answers = []; // will hold the updated list of answers.
            console.log(`new option added at index ${index}`)
            console.log('now looking at the indexes of existing elements in the props.mcqChecked array..')
            console.log(`---------------------------------------------------------`)
            _mcqChecked.forEach((answerIndex, count) => {
                console.log(`Element #${count+1} in answers list is at index of options list: ${answerIndex}`)
                if(answerIndex >= index){
                    console.log(`The current option at index position ${answerIndex} conflicts with the index of the newly inserted option (${index})`)
                    console.log(`Index of current option will be modified to ${answerIndex}+1. Current option will now have index of ${answerIndex+1} while newly added option has index ${index}`)
                    _mcqChecked[count] = answerIndex+1;
                    // _mcq_answers.push(props.selectedPlaygroundQuestion.code_blocks[tempMcq[count]])
                }
                else{
                    console.log(`The current option at index position ${answerIndex} doesnt conflict with index of the newly inserted option (${index})`)
                    console.log('Index of current option will be unaffected and remain the same')
                }
            })

            // update the mcq_answers in the current question's object
            _mcqChecked.forEach(answerIndex => {
                _mcq_answers.push(props.selectedPlaygroundQuestion.code_blocks[answerIndex])
            })
                
            console.log(_mcq_answers)
            props.setSelectedPlaygroundQuestion({...props.selectedPlaygroundQuestion, mcq_answers: _mcq_answers})

            // update the checked mcq list
            console.log(`The new list with the answers' indexes: ${_mcqChecked}`)
            // finally set the checked list so checkboxes are toggled
            props.setMcqChecked(_mcqChecked)
        }
        updateSelectedChapter()

    }

    // function for when option's delete button is pressed
    const handleRemoveAction = (index) => {
        console.log(props.selectedPlaygroundQuestion)

        // update the mcq options list after removing
        let _options =  props.selectedPlaygroundQuestion.code_blocks;
        _options.splice(index, 1) // remove 1 option from specified index
        props.setSelectedPlaygroundQuestion({...props.selectedPlaygroundQuestion, code_blocks: _options })

        if(props.selectedPlaygroundQuestion.question_type == "mcq"){
            let tempMcq = props.mcqChecked // a copy
            let _mcq_answers = []; // will hold the updated list of answers.
            let deleteList = []; // list that specifies which index to delete from props.mcqChecked list
            // adjust the indexes in answers array after removing option
            tempMcq.forEach((answerIndex, count) => {

                if(answerIndex == index) {
                    deleteList.push(answerIndex) // add the value to be deleted to this list
                    // tempMcq.splice(count, 1)
                    // delete tempMcq[count]
                }
                else if(answerIndex > index){
                    tempMcq[count] = answerIndex-1;
                }
            })

            // go thhru delete list and delete the values that appear in it in the props.mcqChecked list
            deleteList.forEach(deletedValue => {
                var deletedValueIndex = tempMcq.indexOf(deletedValue)
                tempMcq.splice(deletedValueIndex, 1)
            })
            

            // update the mcq_answers in the current question's object
            tempMcq.forEach(answerIndex => {
                if(answerIndex != undefined) {
                    _mcq_answers.push(props.selectedPlaygroundQuestion.code_blocks[answerIndex])
                }
            })
            console.log(_mcq_answers)
            props.setSelectedPlaygroundQuestion({...props.selectedPlaygroundQuestion, mcq_answers: _mcq_answers})

            // update the checked mcq list
            console.log(`The new list with the answers' indexes: ${tempMcq}`)
            // finally set the checked list so checkboxes are toggled
            props.setMcqChecked(tempMcq)
        }

        updateSelectedChapter()

    }
  
    // handler function when text in input
    const handleTextInput = (e, inputType, index) => {
        e.preventDefault()
        let _selectedQuestion =  { ...props.selectedPlaygroundQuestion }
        if(inputType == "question_title" || inputType == "question_description"){
            _selectedQuestion[`${inputType}`] = e.target.value;
        }
        else if(inputType == "code_blocks") {
            if(_selectedQuestion.question_type == "mcq"){
                let mcq_answer_index = _selectedQuestion.mcq_answers.indexOf(_selectedQuestion[`${inputType}`][index])
                if(mcq_answer_index != -1){
                    _selectedQuestion['mcq_answers'][mcq_answer_index] = e.target.value;
                }
            }
            _selectedQuestion[`${inputType}`][index] = e.target.value;
        }
        props.setSelectedPlaygroundQuestion(_selectedQuestion)
        updateSelectedChapter()
    }

    // funciton question type is switched
    const onQuestionTypeSelect = (e) => {
        let question_type = e.target.value
        let _selectedQuestion =  { ...props.selectedPlaygroundQuestion }
        if(question_type == "code_blocks"){
            if(_selectedQuestion['mcq_answers']){
                _selectedQuestion.question_type = 'code_blocks'
                delete _selectedQuestion['mcq_answers'] 
                console.log('mcq_answers property deleted')
                console.log(_selectedQuestion)
                props.setSelectedPlaygroundQuestion(_selectedQuestion)
            }
            else
                console.log('Error: this mcq question doesnt have a mcq_answers property')
        }
        else if(question_type == "mcq"){
            _selectedQuestion.question_type = 'mcq'
            props.setMcqChecked([0])
            _selectedQuestion['mcq_answers']= [_selectedQuestion.code_blocks[0]]
            console.log(_selectedQuestion)
            props.setSelectedPlaygroundQuestion(_selectedQuestion)
        }
        updateSelectedChapter()
    }

    // handler function when dropdown option is clicked
    const onQuestionSelect = (e) => {
        // the id field of the question
        let questionId = (e.target.value)

        // use question Id to search for associated question
        var chosenQuestion = props.selectedChapter.playground.find(question => question.id == questionId)
        console.log(chosenQuestion)
        if(chosenQuestion.question_type == "mcq"){
            console.log(chosenQuestion.mcq_answers)
        }
        else {
            console.log("Not an mcq question")
        }
        props.setSelectedPlaygroundQuestion(chosenQuestion)


        if(chosenQuestion.question_type == "mcq") {
            // finding the index of the answers in the options list
            let checkedSet = chosenQuestion.mcq_answers.map(option => {
                return chosenQuestion.code_blocks.indexOf(option)
            })
            
            console.log(checkedSet);

            props.setMcqChecked(checkedSet);
        }
    }

    const createNewQuestion = (type) => {
        let question = {
            code_blocks: [
                'New option 1',
                'New option 2'
            ],
            id: uuidv4(),
            question_description: 'Ask your full question here',
            question_title: 'The title of your question',
            question_type: type
        }

        if(type == 'mcq'){
            question['mcq_answers'] =[
                'New option 1'
            ]
        }

        let clonedChapter = props.selectedChapter
        var questionsArray = clonedChapter.playground
        questionsArray.push(question)
        console.log(questionsArray)
        props.setSelectedChapter({ ...clonedChapter, playground: questionsArray})
        props.setSelectedPlaygroundQuestion(question)
    }

    // used to generate the question dropdown options
    const QuestionOptions = props.selectedChapter.playground.map(question => {
        return (<MenuItem key={question.id} value={question.id}>
            {question.question_title}
          </MenuItem>)
    })

    return (
        <Box sx={{display: 'flex', flexDirection: 'row', width: '90%', maxHeight: '77vh'}}>
            
            {/* The question editor section */}

            <Box sx={{ width: '80%', overflow: 'auto', p: 1, m: 1}}>
                {props.selectedPlaygroundQuestion ?

                    <Box
                        sx={{
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                        p: 1,
                        m: 1,
                        alignItems: "center",
                    }}>
                        <Typography sx={{textAlign: 'center', fontSize: 'h6.fontSize', fontWeight: 'bold'}}>
                            Edit your question here
                        </Typography> 
                        
                        {/* question id and title text box and question type select and delete button*/}
                        <Box
                            sx={{
                            "& .MuiTextField-root": {
                                m: 2,
                                mt: 4,
                                width: "25ch",
                            },
                            display: 'flex',
                            flexDirection: 'row'
                            }}
                        >
                            <TextField
                                disabled
                                id="question_id_txt"
                                label="Question ID"
                                value={props.selectedPlaygroundQuestion.id} 
                            />
                            <TextField
                                id="question_title_txt"
                                label="Question title"
                                value={props.selectedPlaygroundQuestion.question_title}
                                onChange={(e) => {handleTextInput(e, 'question_title', -7)}}
                                //onInputChange(e, 'chapter','subscription_code', 0)}
                            />

                            <Box sx={{display: 'flex', flexDirection: 'column', width: 170,}}>
                                <FormControl sx={{mt: 3}}>
                                <InputLabel id="question-type-select-label">Question type</InputLabel>
                                <Select
                                    sx={{
                                        m: 1,
                                    }}
                                    labelId={'question-type-select-label'}
                                    id={'question-type-select'}
                                    value={props.selectedPlaygroundQuestion.question_type}
                                    // label={'Question type'}
                                    onChange={(e) => {onQuestionTypeSelect(e)}}
                                >
                                    <MenuItem value={'mcq'}>MCQ</MenuItem>
                                    <MenuItem value={'code_blocks'}>Code blocks</MenuItem>
                                </Select>
                                </FormControl>
                            </Box>

                            <IconButton color="error" onClick={() => {handleDeleteAction()}}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                        
                        {/* Question desc textbox */}
                        <Box
                            sx={{
                            m: 1,
                            p: 2,
                            width: "35%",
                            }}
                        >
                            <TextField
                                id="question-desc-textarea"
                                label="Question description"
                                multiline
                                rows={4}
                                fullWidth
                                value={props.selectedPlaygroundQuestion.question_description}
                                onChange={(e) => {handleTextInput(e,'question_description', -7)}}
                            />
                        </Box>
                        

                        <Box>
                            
                            {/* The question's list of mcq options */}
                            <List >
                               {    props.selectedPlaygroundQuestion.code_blocks.map((value, index, array) => {
                                        const labelId = `checkbox-list-label-${index}`;
                                        const optionTxtBoxId = `option-list-txtbox-${index}`
                                        return (

                                            <ListItem
                                            key={index}
                                            >
                                                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                                                    {/* The add button above each option */}
                                                    <Box sx={{display: 'flex', justifyContent: 'center', mb: 1}} >
                                                        <IconButton edge="end" aria-label="add-action" onClick={()=>{handleAddOption(index)}}>
                                                            <AddIcon />
                                                        </IconButton>
                                                    </Box>
                                                    
                                                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                                                        {/* <ListItemButton role={undefined} onClick={handleToggle(value)} dense> */}
                                                        {/* The checkbox associated with the option. Checked = answer of question */}
                                                        {props.selectedPlaygroundQuestion.question_type == 'mcq' ? 
                                                        <ListItemIcon>
                                                            <Checkbox
                                                                edge="start"
                                                                checked={props.mcqChecked.indexOf(index) !== -1}
                                                                tabIndex={-1}
                                                                disableRipple
                                                                onChange={handleCheckBoxToggle(index)}
                                                                inputProps={{ 'aria-labelledby': labelId }}
                                                            />
                                                        </ListItemIcon> : <div></div>
                                                        }
                                                        {/* <ListItemText id={labelId} primary={`Line item ${value + 1}`} /> */}
                                                        {/* The option's textbox*/}
                                                        <TextField sx={{width: 360}} id={optionTxtBoxId} value={value} onChange={(e)=> {handleTextInput(e, 'code_blocks', index)}} />
                                                        {/* The delete button */}
                                                        <Box sx={{display: 'flex', justifyItems: 'space-evenly'}}>
                                                            <IconButton edge="end" aria-label="remove-action" color="error" onClick={()=>{handleRemoveAction(index)}}>
                                                                <RemoveIcon />
                                                            </IconButton>
                                                        </Box>
                                                        {/* </ListItemButton> */}
                                                    </Box>
                                                    {/* If its the last option in the list, show an add button below it as well. */}
                                                    {index + 1  == array.length ?  
                                                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 1}} >
                                                            <IconButton edge="end" aria-label="add-action" onClick={()=>{handleAddOption(index+1)}}>
                                                                <AddIcon />
                                                            </IconButton>
                                                        </Box>
                                                        :
                                                        <Box>
                                                        </Box>
                                                    }
                                                </Box>
                                        
                                            </ListItem>
                                        );
                                    })
                                }
                            </List>

                        </Box>
                    </Box>
               :
                    <Box sx={{textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                     <Typography sx={{textAlign: 'center', fontSize: 'h6.fontSize', fontWeight: 'bold'}}>
                            {props.selectedChapter.playground.length == 0 ? 
                            'Create your first playground Question. Choose which type you want from below'
                            :
                            'Create a new playground question or edit an existing one' }
                        </Typography> 

                        {/* Two buttons. one for mcq type and other for code blocks */}
                        <Box sx={{display: 'flex', flexDirection: 'column' ,textAlign: 'center', mt: 5, justifySelf: 'center',}}>
                        <Button onClick={() => createNewQuestion('mcq')}>
                            Multiple choice
                        </Button>
                        <Button onClick={() => createNewQuestion('code_blocks')}>
                            Code blocks
                        </Button>
                                </Box>
                    </Box>
                }
            </Box>

            <Divider orientation="vertical" />

            {/* Question select drop down */}
            <Box sx={{ maxWidth: '20%', minWidth: '20%', p: 1, m: 1, display: 'flex', flexDirection: 'column'}}>
            
                <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    <Typography sx={{textAlign: 'center', fontSize: 'h6.fontSize', fontWeight: 'bold'}}>Questions</Typography>
                    <IconButton aria-label="refresh-playground-picker" onClick={() => {console.log(props.selectedPlaygroundQuestion)}} >
                        <RefreshIcon/>
                    </IconButton>
                </Box>
                
                <Select
                sx={{
                    m: 2,
                    minWidth: 125,
                }}
                id="chap-lesson-select"
                displayEmpty
                defaultValue={""}
                value={props.selectedPlaygroundQuestion ? props.selectedPlaygroundQuestion : '' }
                onChange={(e) => onQuestionSelect(e)}
                renderValue={(value) => {
                    if (value == '') {
                    return 'Select a question'
                    } else {
                    return value.question_title;
                    }
                }}
                >
                <MenuItem disabled value="">
                    <em>{QuestionOptions.length == 0 ? 'This chapter has no questions!' : 'Select a question to edit.'}</em>
                </MenuItem>
                    {QuestionOptions}
                </Select>
            </Box>
        </Box>
    )

  }

  export default PlaygroundEditor;