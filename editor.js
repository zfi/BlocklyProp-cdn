
/*
 * Copyright (c) 2019 Parallax Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the “Software”), to deal in the Software without
 * restriction, including without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/** GLOBAL VARIABLES **/

/**
 *
 * @type {*|jQuery}
 */
var baseUrl = $("meta[name=base]").attr("content");


/*
* TODO: This is used in the  blocklypropclient.js file, but that file is loaded
*  first, so when JS is condensed, make sure this global is decalred at the top
*  of the file
*/

/**
 *
 * @type {*|jQuery}
 */
var cdnUrl = $("meta[name=cdn]").attr("content");


/**
 *
 * @type {boolean}
 */
var user_authenticated = ($("meta[name=user-auth]").attr("content") === 'true') ? true : false;


/**
 *
 * @type {boolean}
 */
var isOffline = ($("meta[name=isOffline]").attr("content") === 'true') ? true : false;


/**
 * Global variable that holds the original version of the loaded
 * project.
 *
 * @type {string}
 */
var projectData = null;


/**
 * Constant string that represents the base, empty project header
 *
 * @type {string}
 *
 * @description Converting the string to a constant because it is referenced
 * in a number of places. The string is sufficiently complex that it could
 * be misspelled without detection.
 */
const EmptyProjectCodeHeader = '<xml xmlns="http://www.w3.org/1999/xhtml">';


/**
 * Force the saveCheck() function to exit immediately with a false result
 *
 * TODO: This flag is used in exactly one place. Why do we need it?
 *
 * @type {boolean}
 */
var ignoreSaveCheck = false;


/**
 *
 * @type {number}
 */
var last_saved_timestamp = 0;


/**
 * Timestamp to record when the current project was last saved to
 * storage
 *
 * @type {number}
 */
var last_saved_time = 0;


/**
 * The primary key for the project (online version)
 *
 * @type {number}
 */
var idProject = 0;


/**
 * Uploaded project XML code
 *
 * @type {string}
 */
var uploadedXML = '';


/**  WIP/TODO: generate svg icons and inject them.  This keeps the HTML simple and clean.
 *
 * @type {object}
 */
bpIcons = {
    warningCircle:       '<svg width="15" height="15"><path d="M7,8 L8,8 8,11 8,11 7,11 Z" style="stroke-width:1px;stroke:#8a6d3b;fill:none;"/><circle cx="7.5" cy="7.5" r="6" style="stroke-width:1.3px;stroke:#8a6d3b;fill:none;"/><circle cx="7.5" cy="5" r="1.25" style="stroke-width:0;fill:#8a6d3b;"/></svg>',
    dangerTriangleBlack: '<svg width="15" height="15"><path d="M1,12 L2,13 13,13 14,12 8,2 7,2 1,12 Z M7.25,6 L7.75,6 7.5,9 Z" style="stroke-width:1.5px;stroke:#000;fill:none;"/><circle cx="7.5" cy="10.75" r="1" style="stroke-width:0;fill:#000;"/><circle cx="7.5" cy="5.5" r="1" style="stroke-width:0;fill:#000;"/></svg>',
    dangerTriangle:      '<svg width="15" height="15"><path d="M1,12 L2,13 13,13 14,12 8,2 7,2 1,12 Z M7.25,6 L7.75,6 7.5,9 Z" style="stroke-width:1.5px;stroke:#a94442;fill:none;"/><circle cx="7.5" cy="10.75" r="1" style="stroke-width:0;fill:#a94442;"/><circle cx="7.5" cy="5.5" r="1" style="stroke-width:0;fill:#a94442;"/></svg>',
    checkMarkWhite:      '<svg width="14" height="15"><path d="M2.25,6 L5.5,9.25 12,2.5 13.5,4 5.5,12 1,7.5 Z" style="stroke:#fff;stroke-width:1;fill:#fff;"/></svg>',
    checkMarkGreen:      '<svg width="14" height="15"><path d="M2.25,6 L5.5,9.25 12,2.5 13.5,4 5.5,12 1,7.5 Z" style="stroke:#3c763d;stroke-width:1;fill:#3c763d;"/></svg>',
    downArrowWhite:      '<svg width="14" height="15"><path d="M5.5,0 L8.5,0 8.5,9 12.5,9 7,14.5 1.5,9 5.5,9 Z" style="stroke:#fff;stroke-width:1;fill:#fff;"/></svg>',
    downArrowBoxWhite:   '<svg width="14" height="15"><path d="M5.5,0 L8.5,0 8.5,6 12.5,6 7,11.5 1.5,6 5.5,6 Z M0.5,12 L13.5,12 13.5,14.5 0.5,14.5 Z" style="stroke:#fff;stroke-width:1;fill:#fff;"/></svg>',
    terminalWhite:       '<svg width="14" height="15"><path d="M3,4.5 L10,4.5 M3,6.5 L6,6.5 M3,8.5 L8,8.5 M1,1 L13,1 13,14 1,14 1,1 M2,0 L12,0 M14,2 L14,13 M12,15 L2,15 M0,2 L0,13" style="stroke:#fff;stroke-width:1;fill:none;"/></svg>',
    graphWhite:          '<svg width="13" height="14"><path d="M.5,0 L.5,13.5 L12.5,13.5 M3.5,0 L3.5,13.5 M6.5,0 L6.5,13.5 M9.5,0 L9.5,13.5 M12.5,0 L12.5,13.5 M.5,3.5 L12.5,3.5 M.5,7 L12.5,7 M.5,10.5 L12.5,10.5 M.5,.5 L12.5,.5" style="stroke:rgba(255,255,255,.6);stroke-width:1;fill:none;"/><path d="M0,13 L6,5 L9,8 L14,2" style="stroke:#fff;stroke-width:2;fill:none;"/></svg>',
    searchWhite:         '<svg width="14" height="15"><path d="M1.5,13.25 L4.5,8.75" style="stroke:#fff;stroke-width:2px;fill:none;"/><circle cx="7" cy="5" r="3.5" style="stroke:#fff;stroke-width:1.5px;fill:none;"></circle></svg>',
    magicWandWhite:      '<svg width="14" height="15"><path d="M1,10 L5,10 5,11 1,11 Z M2,12 L6,12 6,13 2,13 Z M1,14 5,14 5,15 1,15 Z M0.5,2.75 L2.5,0.6 5.5,3.5 3.5,5.5 Z M5,7 L7,4.75 14,12 12,14 Z M0,7 Q1.5,6.5 2,5 Q2.5,6.5 4,7 Q2.5,7.5 2,9 Q1.5,7.5 0,7 Z M7,3 Q9.5,2.5 10,0 Q10.5,2.5 13,3 Q10.5,3.5 10,6 Q9.5,3.5 7,3 Z" style="stroke-width:0;fill:#fff;"/></svg>',
    undoWhite:           '<svg width="15" height="15"><path d="M3.5,6.5 L2.25,4.5 0.75,10.25 6,10.5 5,8.5 Q8.5,5.5 12,7 Q8,3.5 3.5,6.5 Z M11,11 L14.5,11 Q12.5,6 7,8.25 Q11,8 11,11 Z" style="stroke-width:0;fill:#fff;"/></svg>',
    redoWhite:           '<svg width="15" height="15"><path d="M11.5,6.5 L12.75,4.5 14.25,10.25 9,10.5 10,8.5 Q6.5,5.5 3,7 Q7,3.5 11.5,6.5 Z M4,11 L0.5,11 Q2.5,6 8,8.25 Q4,8 4,11 Z" style="stroke-width:0;fill:#fff;"/></svg>',
    eyeBlack:            '<svg width="14" height="15" style="vertical-align: middle;"><path d="M0.5,7 C4,1.5 10,1.5 13.5,7 C10,12.5 4,12.5 0.5,7 M0.5,7 C4,3.5 10,3.5 13.5,7" style="stroke:#000;stroke-width:1.5;fill:none;"/><circle cx="7" cy="6.5" r="2.75" style="stroke:#000;stroke-width:1.5;fill:none;"></circle><circle cx="7" cy="6.5" r=".5" style="stroke:#000;stroke-width:1.5;fill:#000;"></circle></svg>',
    eyeWhite:            '<svg width="14" height="15" style="vertical-align: middle;"><path d="M0.5,7 C4,1.5 10,1.5 13.5,7 C10,12.5 4,12.5 0.5,7 M0.5,7 C4,3.5 10,3.5 13.5,7" style="stroke:#fff;stroke-width:1.5;fill:none;"/><circle cx="7" cy="6.5" r="2.75" style="stroke:#fff;stroke-width:1.5;fill:none;"></circle><circle cx="7" cy="6.5" r=".5" style="stroke:#fff;stroke-width:1.5;fill:#fff;"></circle></svg>',
    playWhite:           '<svg width="14" height="15"><path d="M4,3 L4,11 10,7 Z" style="stroke:#fff;stroke-width:1;fill:#fff;"/></svg>',
    pauseWhite:          '<svg width="14" height="15"><path d="M5.5,2 L4,2 4,11 5.5,11 Z M8.5,2 L10,2 10,11 8.5,11 Z" style="stroke:#fff;stroke-width:1;fill:#fff;"/></svg>',
    fileWhite:           '<svg width="14" height="15"><path d="M2,.5 L2,13.5 12,13.5 12,7.5 5.5,7.5 5.5,.5 Z M 8,1.5 L8,5 11,5 Z" style="stroke:#fff;stroke-width:1;fill:#fff;" fill-rule="evenodd"/></svg>',
    eraserWhite:         '<svg width="15" height="15"><path d="M2,12 A1.5,1.5 0 0 1 2,10 L10,2 14.5,6.5 7,14 M10,11 L5.5,6.5 M15,14 L4,14 2,12 M15,13.2 5,13.2" style="stroke:#fff;stroke-width:1;fill:none;"/><path d="M2,12 A1.5,1.5 0 0 1 2,10 L5.5,6.5 10,11 7,14 4,14 Z" style="stroke-width:0;fill:#fff;"/></svg>',
    cameraWhite:         '<svg width="14" height="15"><path d="M1.5,13.5 L.5,12.5 .5,5.5 1.5,4.5 2.5,4.5 4,3 7,3 8.5,4.5 12.5,4.5 13.5,5.5 13.5,12.5 12.5,13.5 Z M 2,9 A 4,4,0,0,0,10,9 A 4,4,0,0,0,2,9 Z M 4.5,9 A 1.5,1.5,0,0,0,7.5,9 A 1.5,1.5,0,0,0,4.5,9 Z M 10.5,6.5 A 1,1,0,0,0,13.5,6.5 A 1,1,0,0,0,10.5,6.5 Z" style="stroke:#fff;stroke-width:1;fill:#fff;" fill-rule="evenodd"/></svg>',
}

// TODO: set up a markdown editor (removed because it doesn't work in a Bootstrap modal...)


/**
 * Ping the Rest API every 60 seconds
 * @type {number}
 */
const pingInterval = setInterval(() => {
    $.get(baseUrl + 'ping');
    },
    60000
);


/**
 *  Clears the fields in the new project modal.
 *  Callback
 */
const clearNewProjectModal = () => {
    // Reset the values in the form to defaults
    $('#new-project-name').val('');
    $('#new-project-description').val('');
    $('#new-project-dialog-title').html(page_text_label['editor_newproject_title']);
}


/**
 *
 * @param mins
 * @param resetTimer
 */
const timestampSaveTime = (mins, resetTimer) => {
    // Mark the time when the project was opened, add 20 minutes to it.
    const d_save = new Date();

    // If the proposed delay is less than the delay that's already in
    // process, don't update the delay to a new shorter time.
    if (d_save.getTime() + (mins * 60000) > last_saved_timestamp) {
        last_saved_timestamp = d_save.getTime() + (mins * 60000);

        if (resetTimer) {
            last_saved_time = d_save.getTime();
        }
    }
};


/**
 *
 */
const checkLastSavedTime = function () {
    const d_now = new Date();
    const t_now = d_now.getTime();
    const s_save = Math.round((d_now.getTime() - last_saved_time) / 60000);

    $('#save-check-warning-time').html(s_save.toString(10));

    //if (s_save > 58) {
    // TODO: It's been to long - autosave, then close/set URL back to login page.
    //}

    if (t_now > last_saved_timestamp && checkLeave() && user_authenticated) {
        // It's time to pop up a modal to remind the user to save.
        $('#save-check-dialog').modal({keyboard: false, backdrop: 'static'});
    }
};


/**
 *
 */
function initUploadModalLabels() {

    // set the upload modal's title to "import" if offline
    if (isOffline) {
        $('#upload-dialog-title').html(page_text_label['editor_import']);
        $('#upload-project span').html(page_text_label['editor_import']);

        // Hide the save-as button.
        $('#save-project-as, save-as-btn').addClass('hidden');
    }
}


/**
 * Check project state to see if it has changed before leaving the page
 *
 * @returns {boolean}
 *
 * TODO: We might get here if we failed to load a new project.
 */
function checkLeave () {
    // Return if there is no project data
    if (!projectData) {
        return false;
    }

    var currentXml = '';
    var savedXml = projectData['code'];

    if (ignoreSaveCheck) {
        return false;
    }
    if (projectData['board'] === 'propcfile') {
        currentXml = propcAsBlocksXml();
    } else {
        currentXml = getXml();
    }

    // TODO: We're checking for a null projectData object above; why are we testing again?
    if (projectData === null) {
        if (currentXml === '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>') {
            return false;
        } else {
            return true;
        }
    } else {
        if (savedXml === currentXml) {
            return false;
        } else {
            return true;
        }
    }
};


/**
 * Verify that the project name and board type form fields have data
 *
 * @returns {boolean} True if form contains valid data, otherwise false
 */
function validateNewProjectForm() {
    // This function should only be used in offline mode
    if (!isOffline) {
        return true;
    }

    // Select the 'proj' class
    let project = $(".proj");

    // Validate the jQuery object based on these rules. Supply helpful
    // error messages to use when a rule is violated
    project.validate({
        rules: {
            'new-project-name': "required",
            'new-project-board-type': "required"
        },
        messages: {
            'new-project-name': "Please enter a project name",
            'new-project-board-type': "Please select a board type"
        }
    });

    return project.valid() ? true : false;
}


/**
 * Insert the text strings (internationalization) for all of the UI
 * elements on the editor page once the page has been loaded.
 */
function initInternationalText() {
    // Locate each HTML element of class 'keyed-lang-string'
    $(".keyed-lang-string").each(function () {

        // Set a reference to the current selected element
        let span_tag = $(this);

        // Get the associated key value that will be used to locate
        // the text string in the page_text_label array. This array
        // is declared in _messages.js
        let pageLabel = span_tag.attr('data-key');

        // If there is a key value
        if (pageLabel) {
            if (span_tag.is('a')) {
                // if the html element is an anchor, add a link
                span_tag.attr('href', page_text_label[pageLabel]);
            } else if (span_tag.is('input')) {
                // if the html element is a form input, set the
                // default value for the element
                span_tag.attr('value', page_text_label[pageLabel]);
            } else {
                // otherwise, assume that we're inserting html
                span_tag.html(page_text_label[pageLabel]);
            }
        }
    });

    // insert text strings (internationalization) into button/link tooltips
    for (let i = 0; i < tooltip_text.length; i++) {
        if (tooltip_text[i] && document.getElementById(tooltip_text[i][0])) {
            $('#' + tooltip_text[i][0]).attr('title', tooltip_text[i][1]);
        }
    }
}


/**
 * Initialize the tool bar icons
 */
function initEditorIcons() {
    // Locate each element that has a class 'bpIcon' assigned and
    // contains a 'data-icon' attribute. Itereate through each
    // match and draw the custom icons into the specified element
    // --------------------------------------------------------------
    $('.bpIcon[data-icon]').each( () => {
        $(this).html(bpIcons[$(this).attr('data-icon')]);
    });
}

/**
 * Configure all of the event handlers
 */
function initEventHandlers() {
    /*
 * TODO: Move javascript that is inline in the HTML files to included scripts.
 *    This keeps the HTML simple and clean.
 *
 * This is a WIP.
*/
    // Set up event handlers - Attach events to nav/action menus/buttons
    $('#prop-btn-comp').on('click',         function () {  compile();  });
    $('#prop-btn-ram').on('click',          function () {  loadInto('Load into RAM', 'bin', 'CODE', 'RAM');  });
    $('#prop-btn-eeprom').on('click',       function () {  loadInto('Load into EEPROM', 'eeprom', 'CODE', 'EEPROM');  });
    $('#prop-btn-term').on('click',         function () {  serial_console();  });
    $('#prop-btn-graph').on('click',        function () {  graphing_console();  });
    $('#prop-btn-find-replace').on('click', function () {  findReplaceCode();  });
    $('#prop-btn-pretty').on('click',       function () {  formatWizard();  });
    $('#prop-btn-undo').on('click',         function () {  codePropC.undo();  });
    $('#prop-btn-redo').on('click',         function () {  codePropC.redo();  });
    $('#btn-view-propc').on('click',        function () {  renderContent('tab_propc');  });
    $('#btn-view-blocks').on('click',       function () {  renderContent('tab_blocks');  });
    $('#btn-view-xml').on('click',          function () {  renderContent('tab_xml');  });
    $('#edit-project-details').on('click',  function () {  editProjectDetails();  });
    $('#download-side').on('click',         function () {  downloadPropC();  });
    $('#term-graph-setup').on('click',      function () {  configure_term_graph();  });
    $('#client-setup').on('click',          function () {  configure_client();  });
    $('#propc-find-btn').on('click',        function () {  codePropC.find(document.getElementById('propc-find').value, {}, true);  });
    $('#propc-replace-btn').on('click',     function () {  codePropC.replace(document.getElementById('propc-replace').value, {needle: document.getElementById('propc-find').value}, true);  });
    $('#find-replace-close').on('click',    function () {  findReplaceCode();  });
    $('#upload-close').on('click',          function () {  clearUploadInfo(false);  });

/*
    $('#selectfile').on('change',
        {fileValue: this.files},
        function (e) {
            console.log(e.data.fileValue);
            uploadHandler(e.data.fileValue);
    });
*/
    // Hamburger menu items
    $('#selectfile-replace').on('click',    function () {  uploadMergeCode(false); });
    $('#selectfile-append').on('click',     function () {  uploadMergeCode(true); });

    $('#selectfile-clear').on('click',      function () {  clearUploadInfo(true);  });
    $('#save-as-btn').on('click',           function () {  saveAsDialog();  });

    $('#save-btn, #save-project').on('click', function () {
        if (isOffline) {
            downloadCode();
        } else {
            saveProject();
        }
    });

    // Load a new project
    $('#new-project-menu-item').on('click', function () {
        clearNewProjectModal();
        showNewProjectModal('open');
    });// window.location = 'blocklyc.html?newProject=true'  });

    $('#btn-graph-play').on('click',        function () {  graph_play();  });
    $('#btn-graph-snapshot').on('click',    function () {  downloadGraph();  });
    $('#btn-graph-csv').on('click',         function () {  downloadCSV();  });
    $('#btn-graph-clear').on('click',       function () {  graphStartStop('clear');  });

    $('#save-as-board-type').on('change',   function () {
        checkBoardType( $('#saveAsDialogSender').html());
    });

    $('#save-as-board-btn').on('click',     function () {  saveProjectAs();  });

    $('#win1-btn').on('click',              function () {  showStep('win', 1, 3);  });
    $('#win2-btn').on('click',              function () {  showStep('win', 2, 3);  });
    $('#win3-btn').on('click',              function () {  showStep('win', 3, 3);  });
    $('#chr1-btn').on('click',              function () {  showStep('chr', 1, 3);  });
    $('#chr2-btn').on('click',              function () {  showStep('chr', 2, 3);  });
    $('#chr3-btn').on('click',              function () {  showStep('chr', 3, 3);  });
    $('#mac1-btn').on('click',              function () {  showStep('mac', 1, 4);  });
    $('#mac2-btn').on('click',              function () {  showStep('mac', 2, 4);  });
    $('#mac3-btn').on('click',              function () {  showStep('mac', 3, 4);  });
    $('#mac4-btn').on('click',              function () {  showStep('mac', 4, 4);  });
    $('.show-os-win').on('click',           function () {  showOS('Windows');  });
    $('.show-os-mac').on('click',           function () {  showOS('MacOS');  });
    $('.show-os-chr').on('click',           function () {  showOS('ChromeOS');  });
    $('.show-os-lnx').on('click',           function () {  showOS('Linux');  });


    $('#save-project-as').on('click',      function () {  saveAsDialog();  });
    $('#download-project').on('click',     function () {  downloadCode();  });
    $('#upload-project').on('click',       function () {  uploadCode();    });
    $('#save-check-dialog').on('hidden.bs.modal', function () {  timestampSaveTime(5, false);  });

    $("#selectfile").focus(function () {
        $('#selectfile-verify-notvalid').css('display', 'none');
        $('#selectfile-verify-valid').css('display', 'none');
        $('#selectfile-verify-boardtype').css('display', 'none');
    });

}


/**
 * disable to upload dialog buttons until a valid file is uploaded
 */
function disableUploadDialogButtons() {
    document.getElementById("selectfile-replace").disabled = true;
    document.getElementById("selectfile-append").disabled = true;
}


/**
 * Reset the upload/import modal window to defaults after use
 */
function resetUploadImportModalDialog() {
    // reset the title of the modal
    if (isOffline) {
        $('upload-dialog-title').html(page_text_label['editor_import']);

    } else {
        $('upload-dialog-title').html(page_text_label['editor_upload']);
    }

    // hide "append" button
    $('#selectfile-append').removeClass('hidden');

    // change color of the "replace" button to blue and change text to "Open"
    $('#selectfile-replace').removeClass('btn-primary').addClass('btn-danger').html(page_text_label['editor_button_replace']);

    // reset the blockly toolbox sizing to ensure it renders correctly:
    resetToolBoxSizing(100);
}


/**
 * Set the client download links
 */
function initClientDownloadLinks() {
    $('.client-win32-link').attr('href', $("meta[name=win32client]").attr("content"));
    $('.client-win64-link').attr('href', $("meta[name=win64client]").attr("content"));
    $('.client-mac-link').attr('href', $("meta[name=macOSclient]").attr("content"));
}


/**
 * Set the URLs for all of the CDN-sourced images
 */
function initCdnImageUrls() {
    $("img").each(function () {
        let img_tag = $(this);

        // Set the source of the image
        let img_source = img_tag.attr('data-src');
        if (img_source) {
            img_tag.attr('src', cdnUrl + img_source);
        }
    });
}


/**
 * Execute this code as soon as the DOM becomes ready.
 */
$(document).ready( () => {
    /* -- Set up amy event handlers once the DOM is ready -- */

    // Update the blockly workspace to ensure that it takes
    // the remainder of the window. This is an async call.
    $(window).on('resize', function () {
        resetToolBoxSizing()
    });

    // Event handler for the OnBeforeUnload event
    // --------------------------------------------------------------
    // This event fires just before the document begins to unload.
    // The unload can be stopped by returning a string message. The
    // browser will then open a modal dialog the presents the
    // message and options for Cancel and Leave. If the Cancel option
    // is selected the unload event is cancelled and page processing
    // continues.
    // --------------------------------------------------------------
    window.addEventListener('beforeunload', function (e) {

        if (isOffline) {
            // Call checkLeave only if we are NOT loading a new project
            if (getURLParameter('openFile') === "true") {
                return;
            }
        }

        if (checkLeave()) {
            e.preventDefault();     // Cancel the event
            e.returnValue = Blockly.Msg.DIALOG_CHANGED_SINCE;
            return Blockly.Msg.DIALOG_CHANGED_SINCE;
        } else if (isOffline) {
            // store the current project into the localStore so that if the page is
            // being refreshed, then it will automatically be reloaded
            projectData.timestamp = this.performance.now();
            window.localStorage.setItem('localProject', JSON.stringify(projectData));
        }
    });

    initInternationalText();
    initEditorIcons();
    initEventHandlers();
    initUploadModalLabels();
    disableUploadDialogButtons();

    // Reset the upload/import modal to its default state when closed
    $('#upload-dialog').on('hidden.bs.modal', resetUploadImportModalDialog());


    if (user_authenticated) {
        $('.auth-true').css('display', $(this).attr('data-displayas'));
        $('.auth-false').css('display', 'none');
    } else {
        $('.auth-false').css('display', $(this).attr('data-displayas'));
        $('.auth-true').css('display', 'none');
    }

    $('.url-prefix').attr('href', function (idx, cur) {
        return baseUrl + cur;
    });

    initCdnImageUrls();
    initClientDownloadLinks();

    idProject = getURLParameter('project');

    //Decode and parse project data coming from a sharelink
    if (window.location.href.indexOf('projectlink') > -1) {
        // Decode the base-64 encoded project link
        let projectRaw = atob($("meta[name=projectlink]").attr("content"));
        if (projectRaw.length > 0) {
            setupWorkspace(JSON.parse(projectRaw));
        }
    } else if (!idProject && !isOffline) {
        // redirect to the home page if the project id was not specified
        // and the code is running in the online mode
        window.location = baseUrl;

    } else if (!idProject && isOffline) {
        // ----------------------------------------------------------
        // If the project id is not provided and the code is
        // operating in the offline mode, open a modal window to
        // prompt the user to load a project form local storage.
        // ----------------------------------------------------------

        // Disable the login link for the BP Client status area
        $('#unauth-login-anchor').attr('href', '#');

        // TODO: Use the ping endpoint to see if we are offline.

        // Stop pinging the Rest API
        // TODO: Why is this necessary?
        clearInterval(pingInterval);

        // hide save interaction elements
        $('.online-only').addClass('hidden');
	    $('.offline-only').removeClass('hidden');

        $("#save_as_dialog_title_text").html('Choose a project name and board type');
        $("#save_as_dialog_button").html('Continue');
        $(".save-as-close").addClass('hidden');


        $('#save-as-project-name').val('MyProject');
        $("#saveAsDialogSender").html('offline');
        $("#save-as-board-type").empty();

        // populate the board type drop down list
        // TODO: Make this a function
        // Change the id to a class reference
        for (key in profile) {
            $("#save-as-board-type").append($('<option />').val(key).text(profile[key].description));
        }

        // Load a project file from local storage
        if (getURLParameter('openFile') === "true" && isOffline) {

            // set title to Open file
            $('#upload-dialog-title').html(page_text_label['editor_open']);

            // hide "append" button
            $('#selectfile-append').addClass('hidden');

            // change color of the "replace" button to blue and change text to "Open"
            $('#selectfile-replace').removeClass('btn-danger').addClass('btn-primary');
            $('#selectfile-replace').html(page_text_label['editor_button_open']);

            // Import a project .SVG file
            $('#upload-dialog').modal({keyboard: false, backdrop: 'static'});

            // TODO: what is this doing here? Shouldn't we be setting up projectData instead of localStore?
            //       Or can this simply be deleted, because the openFile functions will take care of this?
            if (projectData) {
                setupWorkspace(JSON.parse(window.localStorage.getItem('localProject')));
            }
        } else if (window.localStorage.getItem('localProject')) {
            var pd = JSON.parse(window.localStorage.getItem('localProject'));
            // load the project from the browser store
            // check to make sure the project in localStorage is less than 10 seconds old.
            if (pd.timestamp && ((performance.now() - pd.timestamp) < 10000)) {
                setupWorkspace(pd, function () {
                    window.localStorage.removeItem('localProject');
                });
            } else {
                // delete the localStorage (it's now too old), and redirect to the home page
                window.localStorage.removeItem('localProject');
                window.location.href = (isOffline) ? 'index.html' : baseUrl;
            }
        } else if (getURLParameter('newProject') === "true") {
            // Open save-as modal (used as a new-project modal)
            $('#save-as-type-dialog').modal({keyboard: false, backdrop: 'static'});
        } else {
            // No viable project available, so redirect to index page.
            window.location.href = (isOffline) ? 'index.html' : baseUrl;
        }

    } else {
        // We need to test for the case where we are creating a new local project
        // and the project detail are being passed in the Request body
        // TODO: Create a new project from details passed in from the new-project page
        // ----------------------------------------------------------------------------
        $.get(baseUrl + 'rest/shared/project/editor/' + idProject, function(data) { setupWorkspace(data) })
            .fail(function () {
            // Failed to load project - this probably means that it belongs to another user and is not shared.
            utils.showMessage('Unable to Access Project', 'The BlocklyProp Editor was unable to access the project you requested.  If you are sure the project exists, you may need to contact the project\'s owner and ask them to share their project before you will be able to view it.', function () {
                window.location = baseUrl;
            });
        });
    }

    // these are only set up for the offline editor
    if (isOffline) {
        // show the new project modal
        showNewProjectModal();

        // Set up the click even handler for the "New Project" modal dialog
        // return to the splash screen if the user clicks the cancel button
        $('#new-project-cancel').on('click', () => {

            // if the project is being edited, clear the fields and close the modal
            if ($('#open-modal-sender').html() === 'open') {

                $('#new-project-board-dropdown').removeClass('hidden');
                $('#edit-project-details-static').addClass('hidden');

                $('#new-project-board-type').val('');
                $('#edit-project-board-type').html('');
                $('#edit-project-created-date').html('');
                $('#edit-project-last-modified').html('');
                $('#open-modal-sender').html('');

                $('#new-project-dialog').modal('hide');

            } else {
                // otherwise, return to the splash page
                window.location = '/';
            }
        });


    } // isOffline

    // Make sure the toolbox appears correctly, just for good measure.
    resetToolBoxSizing(250);
});


/**
 *  Displays the new project modal.  Sets events and clears the fields.
 * 
 *  @param openModal force the modal to open when set to 'open'
 */
function showNewProjectModal(openModal) {
    // Clear out the board type dropdown menu
    $("#new-project-board-type").empty();

    // Populate the board type dropdown menu with a header first,
    $("#new-project-board-type")
        .append($('<option />')
        .val('')
        .text(page_text_label['project_create_board_type_select'])
        .attr('disabled','disabled')
        .attr('selected','selected')
    );

    // If the editor is passed the 'newProject' parameter, open the
    // New Project modal
    if (getURLParameter('newProject') || openModal === 'open') {
        // Show the New Project modal dialog box

        $('#new-project-dialog').modal({keyboard: false, backdrop: 'static'});

        // Populate the time stamp fields
        let projectTimestamp = new Date();
        $('#edit-project-created-date').html(projectTimestamp);
        $('#edit-project-last-modified').html(projectTimestamp);
    }

    // if the newProject modal was opened from the editor, flag it so if the user
    // hits cancel they don't lose their work
    if (openModal === 'open') {
        $('#open-modal-sender').html('open');
    }

    // then populate the dropdown with the board types 
    // defined in propc.js in the 'profile' object
    // (except 'default', which is where the current project's type is stored)
    for(var boardTypes in profile) {
        if (boardTypes !== 'default' && boardTypes !== 'propcfile') {
            $("#new-project-board-type")
                    .append($('<option />')
                    .val(boardTypes)
                    .text(profile[boardTypes].description));
        }
    }
    // TODO: only show the code-only project option if in Demo/experimental
    if (inDemo) {
        $("#new-project-board-type")
        .append($('<option />')
        .val('propcfile')
        .text(profile['propcfile'].description));
    }

    // when the user clicks the 'Continue' button, validate the form
    $('#new-project-continue').on('click', function () {
        // verify that the project contains a valid board type and project name
        if (validateNewProjectForm()) {
            var code = '';

            // If editing details, preserve the code, otherwise start over
            if (projectData && $('#new-project-dialog-title').html() === page_text_label['editor_edit-details']) {
                if (projectData['board'] === 'propcfile') {
                    code = propcAsBlocksXml();
                } else {
                    code = getXml();
                }
            } else {
                code = EmptyProjectCodeHeader;
            }
    
            // save the form fields into the projectData object       
            pd = {
                'board': $('#new-project-board-type').val(),
                'code': code,
                'created': $('#edit-project-created-date').html(),
                'description': $("#new-project-description").val(),        // simplemde.value(),
                'description-html': $("#new-project-description").val(),   // simplemde.options.previewRender(simplemde.value()),
                'id': 0,
                'modified': $('#edit-project-created-date').html(),
                'name': $('#new-project-name').val(),
                'private': true,
                'shared': false,
                'type': "PROPC",
                'user': "offline",
                'yours': true,
                'timestamp': performance.now(),
            }

            // then load the toolbox using the projectData
            window.localStorage.setItem('localProject', JSON.stringify(pd));
            window.location = 'blocklyc.html';
        }
        resetToolBoxSizing(100); // use a short delay to ensure the DOM is fully ready (TODO: may not be necessary) 
    });
}

/**
 * Reset the sizing of blockly's toolbox and canvas.
 *
 * NOTE: This is a workaround to ensure that it renders correctly
 * TODO: Find a permanent replacement for this workaround.
 *
 * @param resizeDelay milliseconds to delay the resizing, especially
 * if used after a change in the window's location or a during page
 * reload.
 */
function resetToolBoxSizing(resizeDelay) {
    // Vanilla Javascript is used here for speed - jQuery
    // could probably be used, but this is faster. Force
    // the toolbox to render correctly
    setTimeout(() => {
        // find the height of just the blockly workspace by
        // subtracting the height of the navigation bar
        let navTop = document.getElementById('editor').offsetHeight;
        let navHeight = window.innerHeight - navTop;
        let navWidth = window.innerWidth;

        // Build an array of UI divs that display content
        let blocklyDiv = [
            document.getElementById('content_blocks'),
            document.getElementById('content_propc'),
            document.getElementById('content_xml')
        ];

        // Set the size of the divs
        for (let i = 0; i < 3; i++) {
            blocklyDiv[i].style.left = '0px';
            blocklyDiv[i].style.top = navTop + 'px';
            blocklyDiv[i].style.width = navWidth + 'px';
            blocklyDiv[i].style.height = navHeight + 'px';
        }

        // Update the Blockly editor canvas to use the new space
        if (Blockly.mainWorkspace && blocklyDiv[0].style.display !== 'none') {
            Blockly.svgResize(Blockly.mainWorkspace);
        }
    }, resizeDelay || 10);  // 10 millisecond delay
}

/**
 * Populate the projectData global
 *
 * @param data, callback
 *
 */
function setupWorkspace(data, callback) {
    projectData = data;

    // Update the UI with project related details
    showInfo(data);

    // Set the global project ID. in the offline mode, the project
    // id is set to 0 when the project is loaded from local storage.
    // --------------------------------------------------------------
    if (!idProject) {
        idProject = projectData['id'];
    }

    // Set various project settings based on the project board type
    // NOTE: This function is in propc.js
    setProfile(projectData['board']);

    // Determine if this is a pure C project
    if (projectData['board'] !== 'propcfile') {
        initToolbox(projectData['board'], []);

        // Reinstate key bindings from block workspace if this is not a code-only project.
        if (Blockly.codeOnlyKeybind === true) {
            Blockly.bindEvent_(document, 'keydown', null, Blockly.onKeyDown_);
            Blockly.codeOnlyKeybind = false;
        }

        // Create UI block content from project details
        renderContent('blocks');

        // Set the help link to the ab-blocks or s3 reference
        // TODO: modify blocklyc.html/jsp and use an id or class selector
        if (projectData.board === 's3') {
            $('#online-help').attr('href', 'https://learn.parallax.com/s3-blocks');
        } else {
            $('#online-help').attr('href', 'https://learn.parallax.com/ab-blocks');
        }
    } else {
        // No, init the blockly interface
        init(Blockly);

        // Remove keybindings from block workspace if this is a code-only project.
        Blockly.unbindEvent_(document, 'keydown', null, Blockly.onKeyDown_);
        Blockly.codeOnlyKeybind = true;

        // Show PropC editing UI elements
        $('.propc-only').removeClass('hidden');

        // Create UI block content from project details
        renderContent('propc');

        // Set the help link to the prop-c reference
        // TODO: modify blocklyc.html/jsp and use an id or class selector
        $('#online-help').attr('href', 'https://learn.parallax.com/support/C/propeller-c-reference');
    }



    if (projectData && projectData['yours'] === false) {
        $('#edit-project-details').html(page_text_label['editor_view-details'])
    } else {
        $('#edit-project-details').html(page_text_label['editor_edit-details']);
    }

    resetToolBoxSizing();
    timestampSaveTime(20, true);
    setInterval(checkLastSavedTime, 60000);

    // Execute the callback function if one was provided
    if (callback) {
        callback();
    }
}


/**
 * Set the UI fields for the project name, project owner and project type icon
 *
 * @param data is the project data structure
 */
function showInfo(data) {
    if (getURLParameter('debug')) {
        console.log(data);
    }

    // Display the project name
    $(".project-name").text(data['name']);

    // Does the current user own the project?
    if (!data['yours']) {
        // If not, display owner username
        $(".project-owner").text("(" + data['user'] + ")");
    }

    // Create an array of board type icons
    let projectBoardIcon = {
        "activity-board": "images/board-icons/IconActivityBoard.png",
        "s3": "images/board-icons/IconS3.png",
        "heb": "images/board-icons/IconBadge.png",
        "heb-wx": "images/board-icons/IconBadgeWX.png",
        "flip": "images/board-icons/IconFlip.png",
        "other": "images/board-icons/IconOtherBoards.png",
        "propcfile": "images/board-icons/IconC.png"
    };

    // Set the prject icon to the correct board type
    $("#project-icon").html('<img src="' + cdnUrl + projectBoardIcon[ data['board'] ] + '"/>');
};


/**
 *
 */
function saveProject() {
    if (projectData['yours']) {
        var code = '';

        if (projectData['board'] === 'propcfile') {
            code = propcAsBlocksXml();
        } else {
            code = getXml();
        }

        projectData['code'] = code;

        $.post(baseUrl + 'rest/project/code', projectData, function (data) {
            var previousOwner = projectData['yours'];
            projectData = data;
            projectData['code'] = code; // Save code in projectdata to be able to verify if code has changed upon leave

            // If the current user doesn't own this project, a new one is created and the page is redirected to the new project.
            if (!previousOwner) {
                window.location.href = baseUrl + 'projecteditor?id=' + data['id'];
            }
        }).done(function () {
            // Save was successful, show green with checkmark
            var elem = document.getElementById('save-project');
            elem.style.paddingLeft = '10px';
            elem.style.background = 'rgb(92, 184, 92)';
            elem.style.borderColor = 'rgb(76, 174, 76)';

            setTimeout(function () {
                elem.innerHTML = 'Save &#x2713;';
            }, 600);

            setTimeout(function () {
                elem.innerHTML = 'Save&nbsp;&nbsp;';
                elem.style.paddingLeft = '15px';
                elem.style.background = '#337ab7';
                elem.style.borderColor = '#2e6da4';
            }, 1750);
        }).fail(function () {
            // Save failed.  Show red with "x"
            var elem = document.getElementById('save-project');
            elem.style.paddingLeft = '10px';
            elem.style.background = 'rgb(214, 44, 44)';
            elem.style.borderColor = 'rgb(191, 38, 38)';

            setTimeout(function () {
                elem.innerHTML = 'Save &times;';
            }, 600);

            setTimeout(function () {
                elem.innerHTML = 'Save&nbsp;&nbsp;';
                elem.style.paddingLeft = '15px';
                elem.style.background = '#337ab7';
                elem.style.borderColor = '#2e6da4';
            }, 1750);

            utils.showMessage('Not logged in', 'BlocklyProp was unable to save your project.\n\nYou may still be able to download it as a Blockls file.\n\nYou will need to return to the homepage to log back in.');
        });

        // Mark the time when saved, add 20 minutes to it.
        timestampSaveTime(20, true);

    } else {

        // If user doesn't own the project - prompt for a new project name and route through
        // an endpoint that will make the project private.
        saveAsDialog();
    }
};


/**
 *
 */
function saveAsDialog () {
    // Production still uses the uses the plain 'save-as' endpoint for now.
    if (inDemo !== 'demo') {     // if (1 === 1) {

        // Old function - still in use because save-as+board type is not approved for use.
        utils.prompt("Save project as", projectData['name'], function (value) {
            if (value) {
                var code = getXml();
                projectData['code'] = code;
                projectData['name'] = value;
                $.post(baseUrl + 'rest/project/code-as', projectData, function (data) {
                    var previousOwner = projectData['yours'];
                    projectData = data;
                    projectData['code'] = code; // Save code in projectdata to be able to verify if code has changed upon leave
                    utils.showMessage(Blockly.Msg.DIALOG_PROJECT_SAVED, Blockly.Msg.DIALOG_PROJECT_SAVED_TEXT);
                    // Reloading project with new id
                    window.location.href = baseUrl + 'projecteditor?id=' + data['id'];
                });
            }
        });

    } else {

        // Prompt user to save current project first if unsaved
        if (checkLeave() && projectData['yours']) {
            utils.confirm(Blockly.Msg.DIALOG_SAVE_TITLE, Blockly.Msg.DIALOG_SAVE_FIRST, function (value) {
                if (value) {
                    if (isOffline) {
                        downloadCode();
                    } else {
                        saveProject();  
                    }
                }
            }, 'Yes', 'No');
        }

        // Reset the save-as modal's fields
        $('#save-as-project-name').val(projectData['name']);
        $("#save-as-board-type").empty();
        profile.default.saves_to.forEach(function (bt) {
            $("#save-as-board-type").append($('<option />').val(bt[1]).text(bt[0]));
        });

        // Until release to production, make sure we are on demo before displaying the propc option
        if (inDemo === 'demo') {
            $("#save-as-board-type").append($('<option />').val('propcfile').text('Propeller C (code-only)'));
        }

        // Open modal
        $('#save-as-type-dialog').modal({keyboard: false, backdrop: 'static'});
    }
};


/**
 *
 * @param requestor
 */
function checkBoardType (requestor) {
    if (requestor !== 'offline') {
        var current_type = projectData['board'];
        var save_as_type = $('#save-as-board-type').val();
        // save-as-verify-boardtype
        if (current_type === save_as_type || save_as_type === 'propcfile') {
            document.getElementById('save-as-verify-boardtype').style.display = 'none';
        } else {
            document.getElementById('save-as-verify-boardtype').style.display = 'block';
        }
    }
};


/**
 * Save an existing project under a new project ID with the new project owner
 *
 * @param requestor
 */
function saveProjectAs (requestor) {
    // Retrieve the field values
    var p_type = $('#save-as-board-type').val();
    var p_name = $('#save-as-project-name').val();
    
    //get the project's XML code
    var code = '';

    if (requestor !== 'offline') {
        if (projectData && p_type === 'propcfile') {
            code = propcAsBlocksXml();
        } else {
            code = getXml();
        }

        // Save the new project
        projectData['board'] = p_type;
        projectData['code'] = code;
        projectData['name'] = p_name;

        $.post(baseUrl + 'rest/project/code-as', projectData, function (data) {
            // var previousOwner = projectData['yours'];
            projectData = data;
            projectData['code'] = code; // Save code in projectdata to be able to verify if code has changed upon leave

            // Reloading project with new id
            window.location.href = baseUrl + 'projecteditor?id=' + data['id'];
        });
        timestampSaveTime(20, true);
    } else {
        var tt = new Date();
        var pd = {
            'board': p_type,
            'code': EmptyProjectCodeHeader,
            'created': tt,
            'description': "",
            'description-html': "",
            'id': 0,
            'modified': tt,
            'name': p_name,
            'private': true,
            'shared': false,
            'type': "PROPC",
            'user': "offline",
            'yours': true,
            'timestamp': performance.now(),
        }

        window.localStorage.setItem('localProject', JSON.stringify(pd));
        window.location = 'blocklyc.html';
    }  
};


/**
 *
 */
function editProjectDetails() {
    if(isOffline) {
        // Save the current code
        projectData.modified = new Date();
        if (projectData['board'] === 'propcfile') {
            projectData.code = propcAsBlocksXml();
        } else {
            projectData.code = getXml();
        }

        $('#new-project-board-dropdown').addClass('hidden');
        $('#edit-project-details-static').removeClass('hidden');
        $('#new-project-dialog-title').html(page_text_label['editor_edit-details']);

        $('#new-project-name').val(projectData.name);
        $('#new-project-board-type').val(projectData.board);
        $('#edit-project-board-type').html(profile.default.description);
        $('#edit-project-created-date').html(projectData.created);
        $('#edit-project-last-modified').html(projectData.modified);

        // simplemde.value(projectData.description);
        $("#new-project-description").val(projectData.description)

        // Since this modal is being opened from the editor, flag it
        // so that if the user cancels, they don't lose their work.
        $('#open-modal-sender').html('open');

        // show the modal
        $('#new-project-dialog').modal({keyboard: false, backdrop: 'static'});

    } else {
        window.location.href = baseUrl + 'my/projects.jsp#' + idProject;
    }
};


/**
 *
 * @param str
 * @returns {number}
 */
function hashCode(str) {
    var hash = 0, i = 0, len = str.length;
    while (i < len) {
        hash = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
    }
    return (hash + 2147483647) + 1;
}


/**
 * Encode a string to an XML-safe string by replacing unsafe
 * characters with HTML entities
 *
 * @param str
 * @returns {string}
 */
function encodeToValidXml(str) {
    return (str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\t/g, '&#x9;')
        .replace(/\n/g, '&#xA;')
        .replace(/\r/g, '&#xD;')
    );
}


/**
 * Decode a string from an XML-safe string by replacing HTML
 * entities with their standard characters
 *
 * @param str
 * @returns {string}
 */
function decodeFromValidXml(str) {
    return (str
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, '\'')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#x9;/g, '\t')
        .replace(/&#xA;/g, '\n')
        .replace(/&#xD;/g, '\r')
    );
}

/**
 *
 */
function downloadCode() {
    if (projectData && projectData['board'] !== 'propcfile' && getXml().length < 50) {
        alert('You can\'t save an empty project!');
    } else {
        var projXMLcode = '';
        
        if (projectData && projectData['board'] === 'propcfile') {
            projXMLcode = propcAsBlocksXml();
        } else {
            projXMLcode = getXml();
        }

        projXMLcode = projXMLcode.substring(42, projXMLcode.length);
        projXMLcode = projXMLcode.substring(0, (projXMLcode.length - 6));

        var project_filename = 'Project' + idProject;

        if (isOffline) {
            // Create a filename from the project title
            project_filename = projectData['name'].replace(/[^a-z0-9]/gi, '_').toLowerCase();
        }

        utils.prompt(Blockly.Msg.DIALOG_DOWNLOAD, project_filename, function (value) {
            if (value) {
                // get the paths of the blocks themselves and the size/position of the blocks
                var projSVG = document.getElementsByClassName('blocklyBlockCanvas');
                var projSVGcode = projSVG[0].outerHTML.replace(/&nbsp;/g, ' ');
                var projSize = projSVG[0].getBoundingClientRect();
                var projH = (parseInt(projSize.height) + parseInt(projSize.top) + 100).toString();
                var projW = (parseInt(projSize.width) + parseInt(projSize.left) + 236).toString();

                // put all of the pieces together into a downloadable file
                var saveData = (function () {
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.style = "display: none";
                    return function (data, fileName) {
                        var blob = new Blob([data], {type: "octet/stream"});
                        var url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = fileName;
                        a.click();
                        window.URL.revokeObjectURL(url);
                    };
                }());

                // a header with the necessary svg XML header and style information to make the blocks render correctly
                // TODO: make SVG valid.
                var SVGheader = '';
                SVGheader += '<svg blocklyprop="blocklypropproject" xmlns="http://www.w3.org/2000/svg" ';
                SVGheader += 'xmlns:html="http://www.w3.org/1999/xhtml" xmlns:xlink="http://www.w3.org/1999/xlink" ';
                SVGheader += 'version="1.1" class="blocklySvg"><style>.blocklySvg { background-color: #fff; ';
                SVGheader += 'overflow: auto; width:' + projW + 'px; height:' + projH + 'px;} .blocklyWidgetDiv {display: none; position: absolute; ';
                SVGheader += 'z-index: 999;} .blocklyPathLight { fill: none; stroke-linecap: round; ';
                SVGheader += 'stroke-width: 2;} .blocklyDisabled>.blocklyPath { fill-opacity: .5; ';
                SVGheader += 'stroke-opacity: .5;} .blocklyDisabled>.blocklyPathLight, .blocklyDisabled>';
                SVGheader += '.blocklyPathDark {display: none;} .blocklyText {cursor: default; fill: ';
                SVGheader += '#fff; font-family: sans-serif; font-size: 11pt;} .blocklyNonEditableText>text { ';
                SVGheader += 'pointer-events: none;} .blocklyNonEditableText>rect, .blocklyEditableText>rect ';
                SVGheader += '{fill: #fff; fill-opacity: .6;} .blocklyNonEditableText>text, .blocklyEditableText>';
                SVGheader += 'text {fill: #000;} .blocklyBubbleText {fill: #000;} .blocklySvg text {user';
                SVGheader += '-select: none; -moz-user-select: none; -webkit-user-select: none; cursor: ';
                SVGheader += 'inherit;} .blocklyHidden {display: none;} .blocklyFieldDropdown:not(.blocklyHidden) ';
                SVGheader += '{display: block;} .bkginfo {cursor: default; fill: rgba(0, 0, 0, 0.3); font-family: ';
                SVGheader += 'sans-serif; font-size: 10pt;}</style>';

                // a footer to generate a watermark with the project's information at the bottom-right corner of the SVG 
                // and hold project metadata.
                var SVGfooter = '';
                var dt = new Date();
                SVGfooter += '<rect x="100%" y="100%" rx="7" ry="7" width="218" height="84" style="fill:rgba(255,255,255,0.4);" transform="translate(-232,-100)" />';
                SVGfooter += '<text class="bkginfo" x="100%" y="100%" transform="translate(-225,-83)" style="font-weight:bold;">Parallax BlocklyProp Project</text>';
                SVGfooter += '<text class="bkginfo" x="100%" y="100%" transform="translate(-225,-68)">User: ' + encodeToValidXml(projectData['user']) + '</text>';
                SVGfooter += '<text class="bkginfo" x="100%" y="100%" transform="translate(-225,-53)">Title: ' + encodeToValidXml(projectData['name']) + '</text>';
                SVGfooter += '<text class="bkginfo" x="100%" y="100%" transform="translate(-225,-38)">Project ID: ' + idProject + '</text>';
                SVGfooter += '<text class="bkginfo" x="100%" y="100%" transform="translate(-225,-23)">Device: ' + projectData['board'] + '</text>';
                SVGfooter += '<text class="bkginfo" x="100%" y="100%" transform="translate(-225,-8)">Description: ' + encodeToValidXml(projectData['description']) + '</text>';
                SVGfooter += '<text class="bkginfo" x="100%" y="100%" transform="translate(-225,13)" data-createdon="' + projectData['created'] + '" data-lastmodified="' + dt + '"></text>';

                // Check for any file extentions at the end of the submitted name, and truncate if any
                if (value.indexOf(".") !== -1)
                    value = value.substring(0, value.indexOf("."));
                // Check to make sure the filename is not too long
                if (value.length >= 30)
                    value = value.substring(0, 29);
                // Replace any illegal characters
                value = value.replace(/[\\/:*?\"<>|]/g, '_');

                var xmlChecksum = hashCode(projXMLcode).toString();

                var xmlChecksum = '000000000000'.substring(xmlChecksum.length, 12) + xmlChecksum;

                // Assemble both the SVG (image) of the blocks and the blocks' XML definition
                saveData(SVGheader + projSVGcode + SVGfooter + projXMLcode + '<ckm>' + xmlChecksum + '</ckm></svg>', value + '.svg');
            }
        });
    }
}


/**
 *
 */
function uploadCode() {
    if (checkLeave() && !isOffline) {
        utils.showMessage(
            Blockly.Msg.DIALOG_UNSAVED_PROJECT,
            Blockly.Msg.DIALOG_SAVE_BEFORE_ADD_BLOCKS);
    } else {
        $('#upload-dialog').modal({keyboard: false, backdrop: 'static'});
    }
}


/**
 *  NOT USED.
 *
 * @param files
 */
function uploadHandler(files) {
    var UploadReader = new FileReader();
    UploadReader.onload = function () {
        var xmlString = this.result;
        var xmlValid = false;
        var uploadBoardType = '';

        //validate file, screen for potentially malicious code.
        if (files[0].type === 'image/svg+xml'
                && xmlString.indexOf("<svg blocklyprop=\"blocklypropproject\"") === 0
                && xmlString.indexOf("<!ENTITY") === -1
                && xmlString.indexOf("CDATA") === -1
                && xmlString.indexOf("<!--") === -1)
        {
            // TODO: instead of parsing by text indexOf's, use XML properly.
            var uploadedChecksum = xmlString.substring((xmlString.length - 24), (xmlString.length - 12));
            var findBPCstart = '<block';
            if (xmlString.indexOf("<variables>") > -1) {
                findBPCstart = '<variables>';
            }
            uploadedXML = xmlString.substring(xmlString.indexOf(findBPCstart), (xmlString.length - 29));
            
            var computedChecksum = hashCode(uploadedXML).toString();
            computedChecksum = '000000000000'.substring(computedChecksum.length, 12) + computedChecksum;

            var boardIndex = xmlString.indexOf('transform="translate(-225,-23)">Device: ');
            uploadBoardType = xmlString.substring((boardIndex + 40), xmlString.indexOf('</text>', (boardIndex + 41)));

            if (computedChecksum === uploadedChecksum) {
                xmlValid = true;
            }
            if (xmlValid) {
                if (projectData && uploadBoardType !== projectData['board']) {
                    $('#selectfile-verify-boardtype').css('display', 'block');
                } else {
                    $('#selectfile-verify-boardtype').css('display', 'none');
                }
            }
            if (uploadedXML !== '') {
                uploadedXML = EmptyProjectCodeHeader + uploadedXML + '</xml>';
            };

            // TODO: check to see if this is used when opened from the editor (and not the splash screen)
            // maybe projectData.code.length < 43??? i.e. empty project? instead of the URL parameter...
    	    if (getURLParameter('openFile') === "true" && isOffline) {
                var titleIndex = xmlString.indexOf('transform="translate(-225,-53)">Title: ');
                var projectTitle = xmlString.substring((titleIndex + 39), xmlString.indexOf('</text>', (titleIndex + 39)));
                titleIndex = xmlString.indexOf('transform="translate(-225,-8)">Description: ');
                var projectDesc = '';
                if (titleIndex > -1) {
                    projectDesc = xmlString.substring((titleIndex + 44), xmlString.indexOf('</text>', (titleIndex + 44)));
                }


                var tt = new Date();
                titleIndex = xmlString.indexOf('data-createdon="');
                var projectCreated = tt;
                if (titleIndex > -1) {
                    projectCreated = xmlString.substring((titleIndex + 16), xmlString.indexOf('"', (titleIndex + 17)));
                }
                titleIndex = xmlString.indexOf('data-lastmodified="');
                var projectModified = tt;
                if (titleIndex > -1) {
                    projectModified = xmlString.substring((titleIndex + 19), xmlString.indexOf('"', (titleIndex + 20)));
                }

		        pd = {
            	    'board': uploadBoardType,
            	    'code': uploadedXML,
            	    'created': projectCreated,
            	    'description': decodeFromValidXml(projectDesc),
            	    'description-html': '',
            	    'id': 0,
            	    'modified': projectModified,
            	    'name': decodeFromValidXml(projectTitle),
                    'private': true,
            	    'shared': false,
            	    'type': "PROPC",
            	    'user': "offline",
            	    'yours': true,
                    'timestamp': performance.now(),
		        }

                projectData = pd;
	        }
        }

        if (xmlValid === true) {
            $('#selectfile-verify-valid').css('display', 'block');
            document.getElementById("selectfile-replace").disabled = false;
            document.getElementById("selectfile-append").disabled = false;
            uploadedXML = xmlString;
        } else {
            $('#selectfile-verify-notvalid').css('display', 'block');
            document.getElementById("selectfile-replace").disabled = true;
            document.getElementById("selectfile-append").disabled = true;
            uploadedXML = '';
        }
    };
    UploadReader.readAsText(files[0]);
}


/**
 *
 * @param redirect boolean flag to permit page redirection
 */
function clearUploadInfo(redirect) {
    // Reset all of the upload fields and containers
    uploadedXML = '';
    $('#selectfile').val('');
    $('#selectfile-verify-notvalid').css('display', 'none');
    $('#selectfile-verify-valid').css('display', 'none');
    $('#selectfile-verify-boardtype').css('display', 'none');
    document.getElementById("selectfile-replace").disabled = true;
    document.getElementById("selectfile-append").disabled = true;

    // when opening a file but the user cancels, return to the splash screen
    if ( redirect === true) {
        if (isOffline && getURLParameter('openFile') === 'true') {
            window.location = 'index.html';
        }
    }
}


/**
 * Open and load an svg project file
 *
 * @param append is true if the project being loaded will be appended
 * to the existing project
 *
 * @description
 * This is called when the 'Open' button on the Open Project dialog
 * box is selected. At this point, the projectData global object
 * has been populated. In the offline mode, the function copies the
 * project to the browser's localStorage and then redirects the
 * browser back to the same page, but without the 'opeFile..' query
 * string.
 */
function uploadMergeCode(append) {
    if (isOffline) {
        // When opening a file when directed from the splash screen in
        // the offline app, load the selected project
        if (!append && getURLParameter('openFile') === 'true') {
            // Set a timestamp to note when the project was saved into localStorage
            projectData.timestamp = performance.now();
            window.localStorage.setItem('localProject', JSON.stringify(projectData));
            window.location = 'blocklyc.html';
        }
    }

    $('#upload-dialog').modal('hide');

    if (uploadedXML !== '') {
        var projCode = '';
        if (append) {
            projCode = getXml();
            projCode = projCode.substring(42, projCode.length);
            projCode = projCode.substring(0, (projCode.length - 6));
        }

        var newCode = uploadedXML;
        if (newCode.indexOf('<variables>') === -1) {
            newCode = newCode.substring(uploadedXML.indexOf('<block'), newCode.length);
        } else {
            newCode = newCode.substring(uploadedXML.indexOf('<variables>'), newCode.length);
        }
        newCode = newCode.substring(0, (newCode.length - 6));
        
        // check for newer blockly XML code (contains a list of variables)
        if (newCode.indexOf('<variables>') > -1 && projCode.indexOf('<variables>') > -1) {
            var findVarRegExp = /type="(\w*)" id="(.{20})">(\w+)</g;
            var newBPCvars = [];
            var oldBPCvars = [];
    
            var varCodeTemp = newCode.split('</variables>');
            newCode = varCodeTemp[1];
            // use a regex to match the id, name, and type of the varaibles in both the old and new code.
            var tmpv = varCodeTemp[0].split('<variables>')[1].replace(findVarRegExp, function(p, m1, m2, m3) {  // type, id, name
                newBPCvars.push([m3, m2, m1]);  // name, id, type
                return p;
            });
            varCodeTemp = projCode.split('</variables>');
            projCode = varCodeTemp[1];
            tmpv = varCodeTemp[0].replace(findVarRegExp, function(p, m1, m2, m3) {  // type, id, name
                oldBPCvars.push([m3, m2, m1]);  // name, id, type
                return p;
            });
            // record how many variables are in the original and new code
            tmpv = [oldBPCvars.length, newBPCvars.length];
            // iterate through the captured variables to detemine if any overlap
            for (var j = 0; j < tmpv[0]; j++) {
                for (var k = 0; k < tmpv[1]; k++) {
                    // see if var is a match
                    if (newBPCvars[k][0] === oldBPCvars[j][0]) {
                        // replace old variable IDs with new ones 
                        var tmpr = newCode.split(newBPCvars[k][1]);
                        newCode = tmpr.join(oldBPCvars[j][1]);
                        // null the ID to mark that it's a duplicate and 
                        // should not be included in the combined list
                        newBPCvars[k][1] = null;
                    }
                }
            }
            for (k = 0; k < tmpv[1]; k++) {
                if (newBPCvars[k][1]) {
                    // Add var from uploaded xml to the project code
                    oldBPCvars.push(newBPCvars[k]);
                }
            }

            // rebuild vars from both new/old
            tmpv = '<variables>';
            oldBPCvars.forEach(function(vi, j) {
                tmpv += '<variable id="' + vi[1] + '" type="' + vi[2] + '">' + vi[0] + '</variable>';
            });
            tmpv += '</variables>';
            // add everything back together
            projectData['code'] = EmptyProjectCodeHeader + tmpv + projCode + newCode + '</xml>';
        } else if (newCode.indexOf('<variables>') > -1 && projCode.indexOf('<variables>') === -1) {
            projectData['code'] = EmptyProjectCodeHeader + newCode + projCode + '</xml>';
        } else {
            projectData['code'] = EmptyProjectCodeHeader + projCode + newCode + '</xml>';
        }

        //
        if(Blockly.mainWorkspace) {
            Blockly.mainWorkspace.clear();
        }

        // This call fails because there is no Blockly workspace context
        loadToolbox(projectData['code']);

        // CAUTION: This call can redirect to the home page
        clearUploadInfo(false);
    }
}


/**
 *
 * @param profileName
 */
function initToolbox(profileName) {

    var ff = getURLParameter('font');
    
    if(ff) {
        // Replace font family in Blockly's inline CSS
        for (var f = 0; f < Blockly.Css.CONTENT.length; f++) {
            Blockly.Css.CONTENT[f] = Blockly.Css.CONTENT[f].replace(/Arial, /g, '').replace(/sans-serif;/g, "'" + ff + "', sans-serif;");
        }   

        $('html, body').css('font-family', "'" + ff + "', sans-serif");
        $('.blocklyWidgetDiv .goog-menuitem-content').css('font', "'normal 14px '" + ff + "', sans-serif !important'"); //    font: normal 14px Arimo, sans-serif !important;

    } else {
        for (var f = 0; f < Blockly.Css.CONTENT.length; f++) {
            Blockly.Css.CONTENT[f] = Blockly.Css.CONTENT[f].replace(/Arial, /g, '').replace(/sans-serif;/g, "Arimo, sans-serif;");
        }   
    }
    
    Blockly.inject('content_blocks', {
        toolbox: filterToolbox(profileName),
        trashcan: true,
        media: cdnUrl + 'blockly/media/',
        readOnly: (profileName === 'propcfile' ? true : false),
        //path: cdnUrl + 'blockly/',
        comments: false,
        zoom: {
            controls: true,
            wheel: false,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
        },
        grid: {
            spacing: 20,
            length: 5,
            colour: '#fbfbfb',
            snap: false
        }
    });

    init(Blockly);

    // TODO: find a better way to handle this.
    // https://groups.google.com/forum/#!topic/blockly/SgJoEEXuzsg
    Blockly.mainWorkspace.createVariable(Blockly.LANG_VARIABLES_GET_ITEM);
}


/**
 *
 * @param xmlText
 */
function loadToolbox(xmlText) {
    if (Blockly.mainWorkspace) {
        let xmlDom = Blockly.Xml.textToDom(xmlText);
        Blockly.Xml.domToWorkspace(xmlDom, Blockly.mainWorkspace);
    }
}


/**
 * Convert the current project workspace into an XML document
 *
 * @returns {string}
 */
function getXml() {
    if (Blockly.Xml && Blockly.mainWorkspace) {
        var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
        return Blockly.Xml.domToText(xml);
    } else if (projectData && projectData.code) {
        return projectData.code;
    } else {
        // Return the XML for a blank project if none is found.
        return EmptyProjectCodeHeader + '</xml>';
    }
}


/**
 *
 * @param o
 */
function showOS(o) {
    $("body").removeClass('Windows')
            .removeClass('MacOS')
            .removeClass('Linux')
            .removeClass('ChromeOS');
    $("body").addClass(o);
}


/**
 *
 * @param o
 * @param i
 * @param t
 */
function showStep(o, i, t) {
    for (var j = 1; j <= t; j++) {
        $('#' + o + j.toString() + '-btn').addClass('btn-default').removeClass('btn-primary');
        $('#' + o + j.toString()).addClass('hidden');
    }
    $('#' + o + i.toString() + '-btn').removeClass('btn-default').addClass('btn-primary');
    $('#' + o + i.toString()).removeClass('hidden');
}