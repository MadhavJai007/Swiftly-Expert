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
import {RefreshOutlined as RefreshIcon, AddOutlined as AddIcon, RemoveCircleOutlined as RemoveIcon} from '@mui/icons-material';


// TODO: THIS IS UNUSED. REMOVE THIS OR USE IT
export const PlaygroundMCQList = (props) => 

{    props.selectedPlaygroundQuestion.code_blocks.map((value, index, array) => {
        const labelId = `checkbox-list-label-${index}`;
        const optionTxtBoxId = `option-list-txtbox-${index}`
        return (
            <ListItem
              key={index}
              
            >
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <Box sx={{display: 'flex', justifyContent: 'center', mb: 1}} >
                        <IconButton edge="end" aria-label="add-action" onClick={()=>console.log(props.mcqChecked)}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                    
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        {/* <ListItemButton role={undefined} onClick={handleToggle(value)} dense> */}
                        <ListItemIcon>
                        <Checkbox
                            edge="start"
                            checked={props.mcqChecked.indexOf(index) !== -1}
                            tabIndex={-1}
                            disableRipple
                            onChange={props.handleCheckBoxToggle(index)}
                            inputProps={{ 'aria-labelledby': labelId }}
                        />
                        </ListItemIcon>
                        {/* <ListItemText id={labelId} primary={`Line item ${value + 1}`} /> */}
                        <TextField sx={{width: 360}} id={optionTxtBoxId} value={value} onChange={(e)=> {}} />
                        <Box sx={{display: 'flex', justifyItems: 'space-evenly'}}>

                            <IconButton edge="end" aria-label="remove-action" color="error" onClick={()=>console.log(props.selectedPlaygroundQuestion)}>
                                <RemoveIcon />
                            </IconButton>
                        </Box>
                        {/* </ListItemButton> */}
                    </Box>
                    {/* If its the last option in the list, show an add button below it as well. */}
                    {index + 1  == array.length ?  
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 1}} >
                            <IconButton edge="end" aria-label="add-action" onClick={()=>{props.handleAddOption(index+1)}}>
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

