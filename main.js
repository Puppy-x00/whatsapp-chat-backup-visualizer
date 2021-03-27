// UI Elements
let droppable = document.getElementById("file-upload-dialog");
let selfSelector = document.getElementById("self-selector");
let peopleInConversation = document.getElementById("people-in-conversation");
let mainContainer = document.getElementById("main-container");
let chatInfo = document.getElementById("chat-info");
let conversationBetweenString; //Eg : Conversation between John Doe and Jane Doe
let chatContentContainer = document.getElementById("chat-content-container");
let peopleInConversationSet = new Set(); //Set containing the names of people in conversation
let peopleInConversationSetCount; //Number of people in the conversation
let personInChatElement;
let selfPerson; //Self (Us)
let contentArray; //Contents of Text File
let currentDate = new Date('02/01/09');
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const colors = ['color1', 'color2', 'color3', 'color4', 'color5', 'color6', 'color7', 'color8', 'color9'];
const personAndTextAndBGColor = {}; //Object for assigning Person and Background/Text Color


// Variables
// const dateRegex = /([[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{1,4}]*)/;
// const timeRegex = /([[0-9]{1,2}:[0-9]{1,2}\s[aApPmM]{2}]*)/;
// const nameRegex =/-\s([a-zA-Z\s]*):/; // Gets names if they have Alphabets Only. If Phone numbers, they are ignored. (INCORRECT)
// const nameRegex =/-\s(.*):/; //Gets Names and Numbers also, but doesnt work if the message has ':' (Regex matches till that : instead of just name). We need to match till first occurence of ':' only. (INCORRECT)
// const nameRegex =/-\s([^:]*)/; //Matches the Name correctly. (till 1st occurence of :)
// const messageRegex = /-\s([^:]*):\s(.*)/; //2nd Group of this Regex is the message content
const fullRegex = /([[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{1,4}]*),\s([[0-9]{1,2}:[0-9]{1,2}\s[aApPmM]{2}]*)\s-\s([^:]*):\s(.*)/;
const encryptedRegex = /(Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them. Tap to learn more.)/;
const groupCreationRegex = /-\s(.+ created group)\s"(.+)"/;
const groupNameChangeRegex = /-\s(.+ changed the subject from .+ to)\s"(.+)"/;
const groupIconChangeRegex = /-\s(.+ changed this group's icon)/;
const groupMemberJoinedRegex = /-\s(.+ joined using this group's invite link)/;
const groupMemberAddedRegex = /-\s(.+ added .+)/;
const groupDescriptionChangedRegex = /-\s(.+ changed the group description)/;
let regSplit = /(\n)/; //Regex for splitting a String with newline character



function dropHandler(ev) {
    console.log('File(s) dropped');
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file') {

                var file = ev.dataTransfer.files[0],
                    reader = new FileReader();
                reader.onload = function (event) {
                    // console.log(event.target);
                    // console.log(event.target.result);
                    contentArray = event.target.result.split(regSplit);
                    // console.log(contentArray);
                    countPeople(contentArray);

                    personInChatElement = document.getElementsByClassName("person-in-chat");
                    // console.log(people);
                    // console.log(people.length);
                    for (i = 0; i < personInChatElement.length; i++) {
                        personInChatElement[i].addEventListener('click', function () {
                            selfPerson = this.innerHTML;
                            console.log(selfPerson);
                            selfSelector.style.display = 'none';
                            processResult(contentArray);
                            mainContainer.style.display = 'block';
                        });
                    }
                };
                // console.log(file);
                reader.readAsText(file);
            }
        }
    }
}


function dragOverHandler(ev) {
    droppable.style.backgroundColor = '#dededf';
    ev.preventDefault();
}

function dragLeaveHandler(ev) {
    droppable.style.backgroundColor = '#f7f6ff';
    ev.preventDefault();
}

function countPeople(resultArray) {

    conversationBetweenString = 'Conversation between ';
    droppable.style.display = 'none';
    for (i = 0; i < resultArray.length; i++) {
        if (resultArray[i] == '\n' || resultArray[i] == '') {
            continue;
        }
        let match = fullRegex.exec(resultArray[i]);
        if (match != null) {
            peopleInConversationSet.add(match[3]);
        }
        else {
            continue;
        }
    }
    peopleInConversationSetCount = peopleInConversationSet.size;

    let arrayPeople = Array.from(peopleInConversationSet);
    for (let i = 0; i < arrayPeople.length; i++) {
        if (peopleInConversationSetCount <= 10) {
            if (arrayPeople.length > 2) {
                if (i != arrayPeople.length - 1) {
                    conversationBetweenString = conversationBetweenString + arrayPeople[i] + ', ';
                } else {
                    conversationBetweenString = conversationBetweenString + 'and ' + arrayPeople[i];
                }
            } else if (arrayPeople.length == 2) {
                if (i != arrayPeople.length - 1) {
                    conversationBetweenString = conversationBetweenString + arrayPeople[i] + ' and ';
                } else {
                    conversationBetweenString = conversationBetweenString + arrayPeople[i];
                }
            }
        }
        else {
            conversationBetweenString = "";
        }
        // Color Logic
        let randomColor = colors[Math.floor(Math.random() * colors.length)];
        //Assigning Colors
        personAndTextAndBGColor[arrayPeople[i]] = randomColor;

        // Creating perseonElement and appending to to peopleInConversation
        let personElement = document.createElement('div');
        personElement.classList.add('person-in-chat');
        personElement.classList.add('bg' + personAndTextAndBGColor[arrayPeople[i]]);
        personElement.innerText = arrayPeople[i];
        peopleInConversation.appendChild(personElement);
    }


    console.log(personAndTextAndBGColor);
    console.log(conversationBetweenString);
    chatInfo.innerText = conversationBetweenString;
    selfSelector.style.display = 'grid';
}

function processResult(resultArray) {
    let newChatBubbleEle;
    let newDateEle;
    let otherInfoEle;
    let newDate;

    for (i = 0; i < resultArray.length; i++) {
        if (resultArray[i] == '\n' || resultArray[i] == '') {
            continue;
        }
        let match = fullRegex.exec(resultArray[i]);
        if (match == null) {
            let matchGroupCreation = groupCreationRegex.exec(resultArray[i]);
            let matchEncrypted = encryptedRegex.exec(resultArray[i]);
            let matchGroupNameChange = groupNameChangeRegex.exec(resultArray[i]);
            let matchGroupIconChange = groupIconChangeRegex.exec(resultArray[i]);
            let matchGroupMemberJoined = groupMemberJoinedRegex.exec(resultArray[i]);
            let matchGroupMemberAdded = groupMemberAddedRegex.exec(resultArray[i]);
            let matchGroupDescriptionChanged = groupDescriptionChangedRegex.exec(resultArray[i]);

            if (chatContentContainer.lastElementChild != null && chatContentContainer.lastElementChild.className != "date" && chatContentContainer.lastElementChild.className != "other-info" && !matchGroupCreation && !matchEncrypted && !matchGroupNameChange && !matchGroupIconChange && !matchGroupMemberJoined && !matchGroupMemberAdded && !matchGroupDescriptionChanged) {
                chatContentContainer.lastElementChild.children[1].innerHTML = chatContentContainer.lastElementChild.children[1].innerHTML + "<br />" + resultArray[i];
            }
            if ((matchGroupCreation == null && matchEncrypted == null && matchGroupNameChange == null && matchGroupIconChange == null && matchGroupMemberJoined == null && matchGroupMemberAdded == null && matchGroupDescriptionChanged == null)) {
                continue;
            }
            else {
                otherInfoEle = document.createElement('div');
                otherInfoEle.className = "other-info";
                if (matchGroupCreation) {
                    otherInfoEle.innerText = matchGroupCreation[1];
                    chatInfo.innerText = conversationBetweenString || matchGroupCreation[2];
                }
                else if (matchEncrypted) {
                    otherInfoEle.innerText = matchEncrypted[1];
                }
                else if (matchGroupNameChange) {
                    otherInfoEle.innerText = matchGroupNameChange[1];
                    chatInfo.innerText = conversationBetweenString || matchGroupNameChange[2];
                }
                else if (matchGroupIconChange) {
                    otherInfoEle.innerText = matchGroupIconChange[1];
                }
                else if (matchGroupMemberJoined) {
                    otherInfoEle.innerText = matchGroupMemberJoined[1];
                }
                else if (matchGroupMemberAdded) {
                    otherInfoEle.innerText = matchGroupMemberAdded[1];
                }
                else if (matchGroupDescriptionChanged) {
                    otherInfoEle.innerText = matchGroupDescriptionChanged[1];
                }
                chatContentContainer.appendChild(otherInfoEle);
            }

        }
        else {
            newDate = new Date(match[1]);

            if (newDate > currentDate) {
                newDateEle = document.createElement('div');
                newDateEle.className = "date";
                newDateEle.innerText = newDate.getDate() + ' ' + months[newDate.getMonth()] + ', ' + newDate.getFullYear();
                chatContentContainer.appendChild(newDateEle);
                currentDate = newDate;
            }

            newChatBubbleEle = document.createElement('div');
            newChatBubbleEle.className = "self";
            if (match[3] != selfPerson) {
                newChatBubbleEle.className = "other";
            }
            if (match[4] == '<Media omitted>') {
                match[4] = 'Media omitted.'
            }
            newChatBubbleEle.innerHTML = '<div class="person-name">' + match[3] + '</div>' +
                '<p class="message">' + match[4] + '</p>' +
                '<div class="time">' + match[2] + '</div>';
            newChatBubbleEle.children[0].classList.add(personAndTextAndBGColor[match[3]]);
            chatContentContainer.appendChild(newChatBubbleEle);
        }
    }
}

