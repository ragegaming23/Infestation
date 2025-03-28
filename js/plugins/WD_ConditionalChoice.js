//=============================================================================
// Plugin Name: Conditional Choice rules
// Author: Winthorp Darkrites (Winter Dream Games Creator)
// Description: Let the developer disable or hide choices in the "Show Choice" menu based on switches and variables.
// Terms of Use: By using this plugin you agree at our ToU (https://drive.google.com/file/d/1lG2Lep2Unme80ghZD7-fA-hPGWKLsiR7/view)
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Allow to input a check in the "Show Choice" that disables or hide the choice.
 * @author Winthorp Darkrites
 * @url https://ko-fi.com/winterdream
 *
 * @param disabledSE
 * @text Disabled Choice SE
 * @type file
 * @dir audio/se
 * @desc The sound effect to play when a player clicks on a Disabled choice (blank for none)
 * @default
 * 
 * @param hiddenDefault
 * @text Hidden Default
 * @type select
 * @option Do not choose any option ("None Default")
 * @value hidden1
 * @option Select the first option
 * @value hidden2
 * @option Select next (if possible)
 * @value hidden3
 * @option Select previous (if possible)
 * @value hidden4
 * @desc What happens if the default choice is hidden?
 * @default hidden1
 *
 * @param alternativeText
 * @text Disabled Alternative Text
 * @type struct<disableText>[]
 * @desc Show an alternative Text when disabled
 * @default []
 *
 * @param errorHandling
 * @text Error Handling
 * @type select
 * @option Skip the rule and ignore it (Warning in console)
 * @value error1
 * @option Consider the rule to be false (Warning in console)
 * @value error2
 * @option Generate an Error (will crash the game)
 * @value error3
 * @desc What happens if a hidden/disabled formula is wrong?
 * @default error1
 * 
 * @param choiceColors
 * @text Choice Colors
 * @type struct<choiceColors>
 * @desc The colors for active and disabled choices
 * @default {"active":"0","disabled":"7"}
 *
 * @help WD_ConditionalChoice.js
 *
 * This plugin edits the Choice display of RPG Maker MZ based on
 * given conditions by the developer.
 * 
 * How to use:
 * 
 * If you want to add a condition to check to DISABLE a choice 
 * use this format: <<[condition]>>Choice Text.
 *
 * If you want to add a condition to check to HIDE a choice use
 * this format (([condition]))Choice Text.
 *
 * If you want to add both, the order is not important as long as
 * they are before the text: <<[condition]>>(([condition]))Text is 
 * ok as (([condition]))<<[condition]>>Text
 *
 * IMPORTANT: Do NOT place spaces in the conditions formatting as
 * it will result in an error.
 *
 * You can add as many conditions as you like! If you separate them
 * with a comma (",") the plugin will check that EVERY condition is
 * TRUE. If you separate them with a semicolon (";") the plugin will
 * check if ANY condition is TRUE. They don't mix, if you use both
 * the plugin will intend them as comma.
 *
 * Conditions List and their use:
 *
 * - Switch: Use the format s[#] (where # is the switch number) to
 *           check if a switch is ON, use !s[#] to check if a switch 
 *           is OFF. Example: (([s[3],!s[4]]))Hello will hide the 
 *           choice "Hello" if Switch 3 is ON and Switch 4 is off
 * - Variables: Use the format v[#] followed by the math operators
 *              = (equal), != (not equal), > (greater), >= (greater 
 *              or equal), < (lesser) or <= (lesser or equal) and 
 *              the second operator to check (can be another v[#],
 *              a fixed integer or g (for gold).
 *              Example: v[65]<70 checks if Variable 65 is lesser 
 *              than 70. !v[4]>g checks if it's FALSE that variable 
 *              4 is greater than party gold.
 * - Gold: Simply use g for party gold, the use is the same as
 *         variables explained above.
 * - Actor in party: Use p[#] where # is the Actor Database ID to 
 *                   check if the actor is in the party at the moment
 *                   of the choice. Use negative operator !p[#] to
 *                   check if Actor is NOT in the party.
 * - Inventory: Use i[#], w[#] or a[#] to check on Item, Weapons or
 *              Armors where # is the corresponding Item/Weapon/Armor
 *              ID number in the database. You can use this command 
 *              as is to check if the party has the corresponding
 *              item in inventory (equipped weapons and armors are 
 *              checked). Example: i[55] checks if Item 55 is in 
 *              inventory, !a[4] checks if Armor 4 is NOT in inventory
 *              (nor equipped).
 *              You can also add a math operation as explained in Variables
 *              in this case the plugin will count all the items and 
 *              perform a math operation. i[6]>=v[4] checks if Item 6 is
 *              greater or equal than variable 4.
 *
 *
 * Text change for Disabled choices:
 *
 * From the plugin parameters it's possible to add a text code that will 
 * generate a text if the choice is normal and another text if the choice 
 * is disabled.
 *
 * Example: Code: DISABLETEXT001, Default Text: This Choice is Enabled,
 *          Disabled Text: This Choice is Disabled.
 *
 * To use it simply write a choice with the following text:
 * <<[conditions]>>DISABLETEXT001
 *
 * If choice is enbaled the player will see "This Choice is Enabled",
 * otherwise the player will see "This Choice is Disabled".
 *
 * WARNING: DO NOT CREATE A SITUATION WHERE ALL THE CHOICES ARE HIDDEN 
 *          AS IT WILL RESULT IN AN EMPTY CHOICE WINDOW WITHOUT POSSIBILITY 
 *          TO EXIT. AS WELL, IF ALL OPTIONS ARE DISABLED, BE SURE TO HAVE 
 *          A CONDITIONAL BRANCH ESCAPE 
 * 
 * == KNOWN COMPATIBILITY ISSUES ==
 * - GALV Visual Novel Choices: To make it work with this plugin be sure to
 *   have GALV plugin ordered BELOW WD_ConditionalChoices, with a text editor
 *   (better if an IDE) edit the Window_ChoiceList.prototype.itemRectForText
 *   function of GALV, below line txt = txt.replace(/C\[\d*\]/g,""); and
 *   above line const txtSize = this.textWidth(txt) + icons; add this line:
 *   txt = window.WD_Interplugin_Choices.getTextEx(txt);
 * 
 * You can find more scripts and games on my Ko-Fi page:
 * https://ko-fi.com/winterdream
 * and on my Itch.io page:
 * https://winterdreamgamescreator.itch.io/
 * And if you want a direct line with me, you can join my Discord:
 * https://discord.gg/AZR38kGG4F
 * 
 * //////////////////////////////////////////////////
 * VERSION 2.4:
 * - Changed the tag capture to regular expression instead of string
 *   analysis, now you can add the disable or hide tag anywhere in the
 *   text instead of the beginning
 * - Added an external call for compatibility reason (GALV VN Choices)
 *   see help for more informations
 * - Fixed Discord link in help section
 * - Fixed a bug that would not decolor special choice text when disabled
 * - Added the possibility to change active and disabled choices colors,
 *   this is especially helpful if you are using custom skins without
 *   standard colors pattern
 * VERSION 2.3:
 * - Thanks to Jndev9 for the report! The plugin was not checking
 *   equipped weapons and armors when running those conditions,
 *   now it does (for both has/hasn't and count)! Also the Armor 
 *   check throw a fatal error due to a typo in the code, this 
 *   is also fixed.
 * VERSION 2.2:
 * - Added the possibility to check if ANY of the condition is true
 *   to validate the hide/disable condition. To do so, instead of 
 *   separating the conditions with "," separate them with ";".
 *   Don't mix the two or the plugin will work as usual (EVERY condition)
 * VERSION 2.1.1:
 * - Hotfix for v2.1, the rule check were giving the oppostire result
 *   (Thanks again to alistor1213)
 * VERSION 2.1:
 * - Changed the rules check mechanism from string reader to RegEx
 * - Fixed a bug that wouldn't retrieve armors data
 * - Fixed a bug that prevents the correct execution of the rule
 *   if a negative number was used (Thanks to alistor1213 for the report)
 * - Now it allows to use items quantity as second operator
 * - Added Error Handling option for wrong or broken formulas
 * VERSION 2.0:
 * - 100% rework of the code, it has been rebuilt from scratch
 * - Kept retro-compatibility with previous versions
 * - Return of the HIDE funtionality, now perfectly working (use (([ 
 *   and ])) for hide conditions.
 * - Plugin now support more conditions check! (Actors in party, Items
 *   in inventory, gold carried)
 * - Added plugin parameters to personalize buzzer sound and handle 
 *   default selection in case it falls on an hidden choice.
 * - Added the possibility to change the text of a disabled choice 
 * VERSION 1.2:
 * - Removed the HIDE functionality due to big indexing problems
 * - Now using the "escape choice" functionality doesn't 
 *   ovverride the plugin
 * - Using the action button while there is no choice selected
 *   no longer cause to skip the Show Choice event
 * - Trimming of the <<[ and ]>> tags are now limited to the
 *   Show Choice box
 * VERSION 1.1:
 * - Fixed the height of the Show Choice Window
 * VERSION 1.0:
 * - Initial Release
 * //////////////////////////////////////////////////
 */
 /*~struct~disableText:
 * @param textCode
 * @text Text Code
 * @desc The text code to insert in the option. Example: <<[s[1]]>>CODE1
 * @default
 *
 * @param defaultText
 * @text Default Text
 * @desc The text that will be shown when enabled
 * @default
 *
 * @param disableText
 * @text Disabled Text
 * @desc The text that will be shown when disabled
 * @default
 */
 /*~struct~choiceColors:
 * @param active
 * @text Normal Choice
 * @desc The text color for normal choices
 * @default 0
 * @type color
 *
 * @param disabled
 * @text Disabled Choice
 * @desc The text color for normal choices
 * @default 7
 * @type color
 */

 !function(){const params=PluginManager.parameters("WD_ConditionalChoice"),disabledSE=params.disabledSE||"",hiddenDefault=params.hiddenDefault||"hidden1",disableTextCodes=disabledCodesStructurer(params.alternativeText),errorHandling=params.errorHandling||"error1",rawColors=JSON.parse(params.choiceColors),textColors={active:parseInt(rawColors.active)||0,disabled:parseInt(rawColors.disabled)||7};let choicesStructureRecorder=[],commandListArray=[];const choicesDefaultOptions={defaultChoice:-1,cancelChoice:-1},callingWindowResize={flag:!1,rows:0};let moddedChoice=!1;function choicesAnalyzer(r){if(0<r._choices.length){choicesStructureRecorder=[];for(let e=0;e<r._choices.length;e++)choicesStructureRecorder.push({choiceText:r._choices[e],originalIndex:e,newIndex:-1,hidden:!1,disabled:!1});return choicesDefaultOptions.defaultChoice=r._choiceDefaultType,choicesDefaultOptions.cancelChoice=r._choiceCancelType,stringCodeReader(),newChoiceIndex(),commandListArrayBuilder(),!0}return!1}function stringCodeReader(){for(const t of choicesStructureRecorder){var e,r,o,n=checkAndExtractTags(t.choiceText);n.hasDisableTag&&n.hasHideTag?(e=rulesChecker(n.disableConditions,n.hideConditions,"Both"),r=tagRemover(t.choiceText),t.disabled=e.disabled,t.hidden=e.hidden,t.choiceText=choiceTextManager(r,t.disabled)):n.hasDisableTag?(e=rulesChecker(n.disableConditions,n.hideConditions,"Disable"),r=tagRemover(t.choiceText),t.disabled=e.disabled,t.hidden=!1,t.choiceText=choiceTextManager(r,t.disabled)):n.hasHideTag?(n=rulesChecker(n.disableConditions,n.hideConditions,"Hide"),o=tagRemover(t.choiceText),t.disabled=!1,t.hidden=n.hidden,t.choiceText=choiceTextManager(o,t.disabled)):(t.disabled=!1,t.hidden=!1,t.choiceText=choiceTextManager(t.choiceText,!1))}}function tagRemover(e){return e.replaceAll(/<<\[(.*?)\]>>|\(\(\[(.*?)\]\)\)/g,"")}function checkAndExtractTags(e){var r={hasDisableTag:!1,hasHideTag:!1,disableConditions:"",hideConditions:""},o=(checkDuplicateTags(e),e.match(/<<\[(.*?)\]>>/)),o=(o&&(r.hasDisableTag=!0,r.disableConditions=o[1]),e.match(/\(\(\[(.*?)\]\)\)/));return o&&(r.hasHideTag=!0,r.hideConditions=o[1]),r}function checkDuplicateTags(e){var r=(e.match(new RegExp(/<<\[(.*?)\]>>/,"g"))||[]).length,o=(e.match(new RegExp(/\(\(\[(.*?)\]\)\)/,"g"))||[]).length;if(1<r)throw new Error("WD_ConditionalChoice: The choice arguments have 2+ disable conditions, please use only ONE disable tag and put multiple conditions in it separated by a comma. Example: <<[s[1],v[3]>0]>>. The string is: "+e);if(1<o)throw new Error("WD_ConditionalChoice: The choice arguments have 2+ hide conditions, please use only ONE hide tag and put multiple conditions in it separated by a comma. Example: (([s[1],v[3]>0])). The string is: "+e)}function rulesChecker(e,r,o){var n={hidden:!1,disabled:!1};let t,s;switch(o){case"Both":t=rulesSplitter(e),s=rulesSplitter(r),n.disabled=rulesValidator(t.rules,t.isOr),n.hidden=rulesValidator(s.rules,s.isOr);break;case"Disable":t=rulesSplitter(e),n.disabled=rulesValidator(t.rules,t.isOr);break;case"Hide":s=rulesSplitter(r),n.hidden=rulesValidator(s.rules,s.isOr)}return n}function rulesSplitter(e){var r={rules:[],isOr:!1};return e.includes(",")&&!e.includes(";")?(r.rules=e.split(","),r.isOr=!1):!e.includes(",")&&e.includes(";")?(r.rules=e.split(";"),r.isOr=!0):(e.includes(",")&&e.includes(";")?r.rules=splitWithMultipleArguemnts(e,[",",";"]):r.rules=e.split(","),r.isOr=!1),r}function splitWithMultipleArguemnts(r,o){var n=[];let t=0;for(let e=0;e<r.length;e++)o.includes(r[e])&&(n.push(r.slice(t,e)),t=e+1);return t<r.length&&n.push(r.slice(t)),n}function rulesValidator(checkArray,orFlag){let result=!0;for(const rule of checkArray){const regex=/[sviwap]\[\d+\]|g|===|==|<=|>=|!==|!=|=|<|>|[-+]?\d+/g,regexMatch=rule.match(regex),firstInvCheck={isInInventory:!1,quantity:0},secondInvCheck={isInInventory:!1,quantity:0};let isNegative=!1,ruleResult=!1,ruleCheckFinished=!1,optionalAddedRule=!1,mathematicalOperator="",firstOperandResult=null,secondOperandResult=null;if(null===regexMatch){const errorMessage="WD_ConditionalChoices: Couldn't find a valid rule for "+rule+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(errorMessage);continue;case"error2":console.warn(errorMessage),result=!1;continue;case"error3":throw new Error(errorMessage)}}if(1!==regexMatch.length&&3!==regexMatch.length){const errorMessage="WD_ConditionalChoices: Unexpected matches number for rule "+rule+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(errorMessage);continue;case"error2":console.warn(errorMessage),result=!1;continue;case"error3":throw new Error(errorMessage)}}let noLeftOver=rule;const replacedStrings=[];for(const reg of regexMatch){const newString=noLeftOver.replace(reg,"");replacedStrings.push(newString),noLeftOver=newString}if(noLeftOver=replacedStrings[replacedStrings.length-1],""!==noLeftOver&&"!"!==noLeftOver){const errorMessage="WD_ConditionalChoices: Unexepected characters in rule "+rule+"! The following characters aren't processed "+noLeftOver+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(errorMessage);continue;case"error2":console.warn(errorMessage),result=!1;continue;case"error3":throw new Error(errorMessage)}}"!"===noLeftOver&&(isNegative=!0);const firstOperand=regexMatch[0],secondLevelRegex=/[sviwapg]|[-+]?\d+/g,secondLevelregexMatch=firstOperand.match(secondLevelRegex);if(null===secondLevelregexMatch){const errorMessage="WD_ConditionalChoices: Couldn't find a valid first operand for "+rule+"! Couldn't match properly "+firstOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(errorMessage);continue;case"error2":console.warn(errorMessage),result=!1;continue;case"error3":throw new Error(errorMessage)}}switch(secondLevelregexMatch[0]){case"s":if(2!==secondLevelregexMatch.length&&!isNaN(parseInt(secondLevelregexMatch[1]))&&0<parseInt(secondLevelregexMatch[1])){const errorMessage="WD_ConditionalChoices: Couldn't find a valid first operand for "+rule+"! Couldn't match properly "+firstOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(errorMessage);continue;case"error2":console.warn(errorMessage),result=!1;continue;case"error3":throw new Error(errorMessage)}}const switchNumber=parseInt(secondLevelregexMatch[1]),wantedSwitch=$gameSwitches.value(switchNumber);ruleResult=isNegative?!wantedSwitch:wantedSwitch,ruleCheckFinished=!0;break;case"v":if(2!==secondLevelregexMatch.length&&!isNaN(parseInt(secondLevelregexMatch[1]))&&0<parseInt(secondLevelregexMatch[1])){const errorMessage="WD_ConditionalChoices: Couldn't find a valid first operand for "+rule+"! Couldn't match properly "+firstOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(errorMessage);continue;case"error2":console.warn(errorMessage),result=!1;continue;case"error3":throw new Error(errorMessage)}}const variableNumber=parseInt(secondLevelregexMatch[1]);firstOperandResult=$gameVariables.value(variableNumber);break;case"i":if(2!==secondLevelregexMatch.length&&!isNaN(parseInt(secondLevelregexMatch[1]))&&0<parseInt(secondLevelregexMatch[1])){const errorMessage="WD_ConditionalChoices: Couldn't find a valid first operand for "+rule+"! Couldn't match properly "+firstOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(errorMessage);continue;case"error2":console.warn(errorMessage),result=!1;continue;case"error3":throw new Error(errorMessage)}}const itemNumber=parseInt(secondLevelregexMatch[1]);firstInvCheck.isInInventory=checkCompleteInventory(0,$dataItems[itemNumber],itemNumber),firstInvCheck.quantity=countCompleteInventory(0,$dataItems[itemNumber],itemNumber),firstOperandResult=firstInvCheck.quantity,optionalAddedRule=!0;break;case"w":if(2!==secondLevelregexMatch.length&&!isNaN(parseInt(secondLevelregexMatch[1]))&&0<parseInt(secondLevelregexMatch[1])){const errorMessage="WD_ConditionalChoices: Couldn't find a valid first operand for "+rule+"! Couldn't match properly "+firstOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(errorMessage);continue;case"error2":console.warn(errorMessage),result=!1;continue;case"error3":throw new Error(errorMessage)}}const weaponNumber=parseInt(secondLevelregexMatch[1]);firstInvCheck.isInInventory=checkCompleteInventory(1,$dataWeapons[weaponNumber],weaponNumber),firstInvCheck.quantity=countCompleteInventory(1,$dataWeapons[weaponNumber],weaponNumber),firstOperandResult=firstInvCheck.quantity,optionalAddedRule=!0;break;case"a":if(2!==secondLevelregexMatch.length&&!isNaN(parseInt(secondLevelregexMatch[1]))&&0<parseInt(secondLevelregexMatch[1])){const errorMessage="WD_ConditionalChoices: Couldn't find a valid first operand for "+rule+"! Couldn't match properly "+firstOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(errorMessage);continue;case"error2":console.warn(errorMessage),result=!1;continue;case"error3":throw new Error(errorMessage)}}const armorNumber=parseInt(secondLevelregexMatch[1]);firstInvCheck.isInInventory=checkCompleteInventory(2,$dataArmors[armorNumber],armorNumber),firstInvCheck.quantity=countCompleteInventory(2,$dataArmors[armorNumber],armorNumber),firstOperandResult=firstInvCheck.quantity,optionalAddedRule=!0;break;case"p":if(2!==secondLevelregexMatch.length&&!isNaN(parseInt(secondLevelregexMatch[1]))&&0<parseInt(secondLevelregexMatch[1])){const errorMessage="WD_ConditionalChoices: Couldn't find a valid first operand for "+rule+"! Couldn't match properly "+firstOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(errorMessage);continue;case"error2":console.warn(errorMessage),result=!1;continue;case"error3":throw new Error(errorMessage)}}const partyMemberID=parseInt(secondLevelregexMatch[1]),currentParty=$gameParty._actors;let foundActor=!1;for(const actor of currentParty)actor===partyMemberID&&(foundActor=!0);ruleResult=isNegative?!foundActor:foundActor,ruleCheckFinished=!0;break;case"g":if(1!==secondLevelregexMatch.length){const errorMessage="WD_ConditionalChoices: Couldn't find a valid first operand for "+rule+"! Couldn't match properly "+firstOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(errorMessage);continue;case"error2":console.warn(errorMessage),result=!1;continue;case"error3":throw new Error(errorMessage)}}firstOperandResult=$gameParty.gold();break;default:const errorMessage="WD_ConditionalChoices: Couldn't find a valid first operand for "+rule+"! Couldn't match properly "+firstOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(errorMessage);continue;case"error2":console.warn(errorMessage),result=!1;continue;case"error3":throw new Error(errorMessage)}}if(!ruleCheckFinished)if(optionalAddedRule&&1===regexMatch.length)ruleResult=isNegative?!firstInvCheck.isInInventory:firstInvCheck.isInInventory,ruleCheckFinished=!0;else{const mathOp=regexMatch[1];switch(mathOp){case"=":case"==":case"===":mathematicalOperator="===";break;case">":case">=":case"<":case"<=":mathematicalOperator=mathOp;break;case"!=":case"!==":mathematicalOperator="!==";break;default:const errorMessage="WD_ConditionalChoices: Couldn't find a valid math operator for rule "+rule+"! Current text is "+mathOp+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(errorMessage);continue;case"error2":console.warn(errorMessage),result=!1;continue;case"error3":throw new Error(errorMessage)}}}if(!ruleCheckFinished){const secondOperand=regexMatch[2],secondLevelregexMatch2=secondOperand.match(secondLevelRegex);if(null===secondLevelregexMatch2){const errorMessage="WD_ConditionalChoices: Couldn't find a valid second operand for "+rule+"! Couldn't match properly "+secondOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(errorMessage);continue;case"error2":console.warn(errorMessage),result=!1;continue;case"error3":throw new Error(errorMessage)}}switch(secondLevelregexMatch2[0]){case"g":if(1!==secondLevelregexMatch2.length){const errorMessage="WD_ConditionalChoices: Couldn't find a valid second operand for "+rule+"! Couldn't match properly "+secondOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(errorMessage);continue;case"error2":console.warn(errorMessage),result=!1;continue;case"error3":throw new Error(errorMessage)}}secondOperandResult=$gameParty.gold();break;case"s":const errorMessageSwitch="WD_ConditionalChoices: Second Operand can't be a switch! Skipping rule "+rule+"!";switch(errorHandling){case"error1":console.warn(errorMessageSwitch);continue;case"error2":console.warn(errorMessageSwitch),result=!1;continue;case"error3":throw new Error(errorMessageSwitch)}break;case"v":if(2!==secondLevelregexMatch2.length&&!isNaN(parseInt(secondLevelregexMatch2[1]))&&0<parseInt(secondLevelregexMatch2[1])){const errorMessage="WD_ConditionalChoices: Couldn't find a valid second operand for "+rule+"! Couldn't match properly "+secondOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(errorMessage);continue;case"error2":console.warn(errorMessage),result=!1;continue;case"error3":throw new Error(errorMessage)}}const variableNumber=parseInt(secondLevelregexMatch2[1]);secondOperandResult=$gameVariables.value(variableNumber);break;case"i":if(2!==secondLevelregexMatch2.length&&!isNaN(parseInt(secondLevelregexMatch2[1]))&&0<parseInt(secondLevelregexMatch2[1])){const errorMessage="WD_ConditionalChoices: Couldn't find a valid second operand for "+rule+"! Couldn't match properly "+secondOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(errorMessage);continue;case"error2":console.warn(errorMessage),result=!1;continue;case"error3":throw new Error(errorMessage)}}const itemNumber=parseInt(secondLevelregexMatch2[1]);secondInvCheck.isInInventory=checkCompleteInventory(0,$dataItems[itemNumber],itemNumber),secondInvCheck.quantity=countCompleteInventory(0,$dataItems[itemNumber],itemNumber),secondOperandResult=secondInvCheck.quantity;break;case"w":if(2!==secondLevelregexMatch2.length&&!isNaN(parseInt(secondLevelregexMatch2[1]))&&0<parseInt(secondLevelregexMatch2[1])){const errorMessage="WD_ConditionalChoices: Couldn't find a valid second operand for "+rule+"! Couldn't match properly "+secondOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(errorMessage);continue;case"error2":console.warn(errorMessage),result=!1;continue;case"error3":throw new Error(errorMessage)}}const weaponNumber=parseInt(secondLevelregexMatch2[1]);d,secondInvCheck.isInInventory=checkCompleteInventory(1,$dataWeapons[weaponNumber],weaponNumber),secondInvCheck.quantity=countCompleteInventory(1,$dataWeapons[weaponNumber],weaponNumber),secondOperandResult=secondInvCheck.quantity;break;case"a":if(2!==secondLevelregexMatch2.length&&!isNaN(parseInt(secondLevelregexMatch2[1]))&&0<parseInt(secondLevelregexMatch2[1])){const errorMessage="WD_ConditionalChoices: Couldn't find a valid second operand for "+rule+"! Couldn't match properly "+secondOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(errorMessage);continue;case"error2":console.warn(errorMessage),result=!1;continue;case"error3":throw new Error(errorMessage)}}const armorNumber=parseInt(secondLevelregexMatch2[1]);d,secondInvCheck.isInInventory=checkCompleteInventory(2,$dataArmors[armorNumber],armorNumber),secondInvCheck.quantity=countCompleteInventory(2,$dataArmors[armorNumber],armorNumber),secondOperandResult=secondInvCheck.quantity;break;case"p":const errorMessageActor="WD_ConditionalChoices: Second Operand can't be an Actor! Skipping rule "+rule+"!";switch(errorHandling){case"error1":console.warn(errorMessageActor);continue;case"error2":console.warn(errorMessageActor),result=!1;continue;case"error3":throw new Error(errorMessageActor)}break;default:if(isNaN(parseInt(secondLevelregexMatch2[0]))){const errorMessage="WD_ConditionalChoices: Couldn't find a valid second operand for "+rule+"! Couldn't match properly "+secondOperand+"! Skipping rule!";switch(errorHandling){case"error1":console.warn(errorMessage);continue;case"error2":console.warn(errorMessage),result=!1;continue;case"error3":throw new Error(errorMessage)}}else secondOperandResult=parseInt(secondLevelregexMatch2[0])}const ruleMathFormula=firstOperandResult+mathematicalOperator+secondOperandResult,mathResultFormula=eval(ruleMathFormula);ruleResult=isNegative?!mathResultFormula:mathResultFormula}if(!ruleResult&&!orFlag){result=!1;break}if(!ruleResult&&orFlag)result=!1;else if(ruleResult&&orFlag){result=!0;break}}return result}function checkCompleteInventory(e,r,t){r=$gameParty.hasItem(r);let o=!1;if(r)return r;switch(e){case 0:break;case 1:o=n(!0);break;case 2:o=n(!1);break;default:throw new Error("WD_ConditionalChoices: Unexpected mode ("+e+") in checkCompleteInventory function")}return o;function n(e){var r=e?"weapon":"armor";for(const o of $gameParty._actors)for(const n of $gameActors._data[o]._equips)if(n._dataClass===r&&n._itemId===t)return!0;return!1}}function countCompleteInventory(e,r,s){var o=$gameParty.numItems(r);let n=0;switch(e){case 0:return o;case 1:n=t(!0);break;case 2:n=t(!1);break;default:throw new Error("WD_ConditionalChoices: Unexpected mode ("+e+") in countCompleteInventory function")}return o+n;function t(e){var r=e?"weapon":"armor";let o=0;for(const n of $gameParty._actors)for(const t of $gameActors._data[n]._equips)t._dataClass===r&&t._itemId===s&&o++;return o}}function choiceTextManager(e,r){for(const o of disableTextCodes){if(e===o.textCode&&r)return"\\C["+textColors.disabled+"]"+o.disableText;if(e===o.textCode&&!r)return"\\C["+textColors.active+"]"+o.defaultText}return r?"\\C["+textColors.disabled+"]"+e:"\\C["+textColors.active+"]"+e}function newChoiceIndex(){let r=0;for(let e=0;e<choicesStructureRecorder.length;e++)choicesStructureRecorder[e].hidden||(choicesStructureRecorder[e].newIndex=r,r++)}function commandListArrayBuilder(){commandListArray=[];for(const e of choicesStructureRecorder)e.hidden||commandListArray.push(e.choiceText);callingWindowResize.rows=commandListArray.length}function returnNextChoice(r){var o=choicesStructureRecorder.length-1,n={foundFlag:!1,foundIndex:-1};for(let e=r.originalIndex+1;e<=o;e++)for(const t of choicesStructureRecorder)if(!n.foundFlag&&t.originalIndex===e&&-1!==t.newIndex){n.foundFlag=!0,n.foundIndex=t.newIndex;break}return n}function returnPrevChoice(r){var o={foundFlag:!1,foundIndex:-1};for(let e=r.originalIndex-1;0<=e;e--)for(const n of choicesStructureRecorder)if(!o.foundFlag&&n.originalIndex===e&&-1!==n.newIndex){o.foundFlag=!0,o.foundIndex=n.newIndex;break}return o}function disabledCodesStructurer(e){let r;var o=[];for(const n of r=null==e?JSON.parse("[]"):JSON.parse(e))o.push(JSON.parse(n));return o}const _alias_Window_ChoiceList_initialize=Window_ChoiceList.prototype.initialize,_alias_Window_ChoiceList_start=(Window_ChoiceList.prototype.initialize=function(){this._wdCCmoddedGlag=!1,_alias_Window_ChoiceList_initialize.call(this)},Window_ChoiceList.prototype.start),_alias_Window_ChoiceList_selectDefault=(Window_ChoiceList.prototype.start=function(){this._wdCCmoddedGlag=choicesAnalyzer($gameMessage),_alias_Window_ChoiceList_start.call(this)},Window_ChoiceList.prototype.selectDefault);function interPlugin_geTxt(e){var r,o=checkAndExtractTags(e);let n="";return n=o.hasDisableTag&&o.hasHideTag?(r=rulesChecker(o.disableConditions,o.hideConditions,"Both"),choiceTextManager(tagRemover(e),r.disabled)):o.hasDisableTag?(r=rulesChecker(o.disableConditions,o.hideConditions,"Disable"),choiceTextManager(tagRemover(e),r.disabled)):o.hasHideTag?choiceTextManager(tagRemover(e),!1):choiceTextManager(e,!1)}Window_ChoiceList.prototype.selectDefault=function(){if(moddedChoice)if(-1===choicesDefaultOptions.defaultChoice||0===commandListArray.length)this.select(-1);else{let e;for(const o of choicesStructureRecorder)if(o.originalIndex===choicesDefaultOptions.defaultChoice){e=o;break}if(e)if(e.hidden)switch(hiddenDefault){case"hidden1":this.select(-1);break;case"hidden2":this.select(0);break;case"hidden3":var r=returnNextChoice(e);r.foundFlag?this.select(r.foundIndex):(r=returnPrevChoice(e)).foundFlag?this.select(r.foundIndex):this.select(-1);break;case"hidden4":var r=returnPrevChoice(e);r.foundFlag?this.select(r.foundIndex):(r=returnNextChoice(e)).foundFlag?this.select(r.foundIndex):this.select(-1)}else this.select(e.newIndex);else console.warn("Unexpected error selecting default Choice"),this.select(-1)}else _alias_Window_ChoiceList_selectDefault.call(this)},Window_ChoiceList.prototype.makeCommandList=function(){var e=this._wdCCmoddedGlag;for(const r of e?commandListArray:$gameMessage.choices())this.addCommand(r,"choice");e&&(moddedChoice=!0,callingWindowResize.flag=!0,this.updatePlacement(),this.updateBackground(),this.placeCancelButton(),this.createContents())},Window_ChoiceList.prototype.drawItem=function(e){var r=this.itemLineRect(e);this.drawTextEx(this.commandName(e),r.x,r.y,r.width)},Window_ChoiceList.prototype.callOkHandler=function(){if(moddedChoice){var r=this.index();let e;for(const o of choicesStructureRecorder)if(r===o.newIndex){e=o;break}e?e.disabled?this.playCustomBuzzer():($gameMessage.onChoice(e.originalIndex),this._messageWindow.terminateMessage(),this.close()):console.error("Critical error in Choice Selection")}else $gameMessage.onChoice(this.index()),this._messageWindow.terminateMessage(),this.close()},Window_ChoiceList.prototype.playCustomBuzzer=function(){""!==disabledSE&&AudioManager.playSe({name:disabledSE,volume:100,pitch:100,pan:0})},Window_ChoiceList.prototype.callCancelHandler=function(){if(moddedChoice)if(-1!==choicesDefaultOptions.cancelChoice&&-2!==choicesDefaultOptions.cancelChoice){let e;for(const r of choicesStructureRecorder)if(r.originalIndex===choicesDefaultOptions.cancelChoice){e=r;break}e?e.hidden||e.disabled?this.playCustomBuzzer():($gameMessage.onChoice(e.originalIndex),this._messageWindow.terminateMessage(),this.close()):(console.error("Unexpected error finding cancel choice"),this.playCustomBuzzer())}else $gameMessage.onChoice($gameMessage.choiceCancelType()),this._messageWindow.terminateMessage(),this.close();else $gameMessage.onChoice($gameMessage.choiceCancelType()),this._messageWindow.terminateMessage(),this.close()},Window_ChoiceList.prototype.windowHeight=function(){return callingWindowResize.flag?this.fittingHeight(callingWindowResize.rows):this.fittingHeight(this.numVisibleRows())},Window_ChoiceList.prototype.maxChoiceWidth=function(){let e=96;if(callingWindowResize.flag)for(const n of commandListArray){var r=this.textSizeEx(n).width,r=Math.ceil(r)+2*this.itemPadding();e<r&&(e=r)}else for(const t of $gameMessage.choices()){var o=this.textSizeEx(t).width,o=Math.ceil(o)+2*this.itemPadding();e<o&&(e=o)}return e},window.WD_Interplugin_Choices={getTextEx:interPlugin_geTxt}}();