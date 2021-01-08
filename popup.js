function main() {
    console.log("hello")
    var isEnabled = document.getElementById("toggle-switch").checked;

    /*
    chrome.tabs.executeScript(
    {
        code: "var isEnabled =" + isEnabled,
        allFrames: true,
    },
    function (result) {
        chrome.tabs.executeScript(
        { file: "content.js", allFrames: true },
        function (result) {}
        );
    }
    );
    */

    console.log(isEnabled);
}
