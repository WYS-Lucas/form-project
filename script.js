console.log("Hello world - view me in the Console of developer tools");

document.addEventListener('DOMContentLoaded', function() {
    const fullNameInput = document.querySelector('#fullName');
    const dobInput = document.querySelector('#dob');
    const graduationDateInput = document.querySelector('#graduationDate');
    const allCheckboxInput = document.querySelectorAll('input[type="checkbox"]');
    const favouriteCoursesInput = Array.from(allCheckboxInput).filter(checkbox => checkbox.id !== 'selectAll'); // Always use "!==" instead of "!="
    const resetButton = document.querySelector('#resetButton');
    const otherInput = document.querySelector('#other');
    const selectAllInput = document.querySelector('#selectAll');
    const outputText = document.querySelector('#outputText');
    
    //if all sub-checkboxes are checked, then change the selectAll checkbox into checked.
    const handleClickCheckbox = () => {
        const allSelected = [...favouriteCoursesInput].every(checkbox => checkbox.checked);
        selectAllInput.checked = allSelected;
    }
    //if selectAll checkbox is checked, change all sub-checkboxes into checked.
    const handleSelectAll = () => {
        const isChecked = selectAllInput.checked;
        favouriteCoursesInput.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    }

    const resetAll = () => {
        document.querySelector('form').reset();
    }

    const modifyDOB = (dob) => {
        const regex = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
        const match = dob.match(regex);
        if (match) {
            const day = parseInt(match[1], 10);
            const month = parseInt(match[2], 10);
            const year = parseInt(match[3], 10);
            return new Date(year, month - 1, day);
        }
        return null;
    }

    const isValidDOBFunction = (dob) => {
        const regex = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
        const match = dob.match(regex);
        if (!match) {
            return false;
        }
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);
        const dobDate = new Date(year, month - 1, day);
        return dobDate.getDate() === day && 
            dobDate.getMonth() === month - 1 &&
            dobDate.getFullYear() === year;
    }

    const calAge = (dob) => {
        let age = new Date().getFullYear() - dob.getFullYear(); //year difference
        const month = new Date().getMonth() - dob.getMonth();
        if (month < 0 || (month === 0 && new Date().getDate() < dob.getDate())) {
            age--;
        }
        return age;
    }

    const isValidOtherFunction = (otherValue) =>    {
        return otherValue.match(/^([A-Z]{4})([0-9]{4})$/);
    }

    const render = () => {
        const fullName = fullNameInput.value;
        const dobValue = modifyDOB(dobInput.value);

        //define boolean variables:
        const isValidFullName = fullName.length >= 3 && fullName.length <= 50;
        const isValidDOB = isValidDOBFunction(dobInput.value);
        const graduationDateValue = new Date(graduationDateInput.value);
        const isValidGraduationDate = graduationDateValue > dobValue;

        if (!isValidFullName) {
            outputText.value = 'Please input a valid full name';
        } else if (!isValidDOB) {
            outputText.value = 'Please input a valid date of birth';
        } else if (!isValidGraduationDate) {
            outputText.value = 'Please input a valid graduation date';
        } else {
            //calculate age, status, graduation date, favourite courses etc.
            const age = calAge(dobValue);
            const year = age === 1 ? 'year' : 'years';
            const graduated = new Date() >= graduationDateValue ? 'graduated' : 'graduate';
            const monthList = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            const graduationDay = graduationDateValue.getDate();
            const graduationMonth = monthList[graduationDateValue.getMonth()];
            const graduationYear = graduationDateValue.getFullYear();
            const otherValue = otherInput.value;
            const isValidOther = isValidOtherFunction(otherValue);
            
            let favouriteList = [];
            let favouriteText = '';
            favouriteCoursesInput.forEach(checkbox => {
                if (checkbox.checked) {
                    favouriteList.push(checkbox.name);
                }
            });
            if (isValidOther) {
                favouriteList.push(otherValue);
            }
            switch (favouriteList.length) {
                case 0:
                    favouriteText = 'I have no favourite course';
                    break;
                case 1:
                    favouriteText = `my favourite course is ${favouriteList[0]}`;
                    break;
                case 2:
                    favouriteText = `my favourite courses are ${favouriteList[0]} and ${favouriteList[1]}`;
                    break;
                case 3:
                    favouriteText = `my favourite courses are ${favouriteList[0]}, ${favouriteList[1]}, and ${favouriteList[2]}`;
                    break;
                case 4:
                    favouriteText = `my favourite courses are ${favouriteList[0]}, ${favouriteList[1]}, ${favouriteList[2]}, and ${favouriteList[3]}`;
                    break;
            }
            outputText.value = `My name is ${fullName} and I am ${age} ${year} old. I ${graduated} on ${graduationMonth} ${graduationDay} ${graduationYear}, and ` + favouriteText + '.';
        }
        //transfer valid dob into right form
    }

    fullNameInput.addEventListener('blur', render);
    dobInput.addEventListener('blur', render);
    graduationDateInput.addEventListener('blur', render);
    favouriteCoursesInput.forEach(checkbox => {
        checkbox.addEventListener('change', handleClickCheckbox);
        checkbox.addEventListener('change', render);
    });
    otherInput.addEventListener('input', render);
    selectAllInput.addEventListener('change', handleSelectAll);
    selectAllInput.addEventListener('change', render);
    resetButton.addEventListener('click',resetAll);
});
