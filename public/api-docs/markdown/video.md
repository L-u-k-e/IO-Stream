## Group Video

There is a one-many relationship between courses and videos. 

## Video [/topics/{video_id}]

A video object has the following attributes:

<table>
    <thead>
        <th>Attribue</th>
        <th>Description</th>
    </thead>
    <tbody>
        <tr>
            <td> id </td>
            <td> A base 64 encoded unique identifier for the video. </td>
        </tr>
        <tr>
            <td> course_id </td>
            <td> The ID (UUID) of the course that the video belongs to. </td>
        </tr>
        <tr>
            <td> title </td>
            <td> The video title. </td>
        </tr>
        <tr>
            <td> description </td>
            <td> A description of the video. </td>
        </tr>
        <tr>
            <td> duration </td>
            <td> An integer representing the duration of the video in seconds.</td>
        </tr>       
        <tr>
            <td> date_uploaded </td>
            <td> A string representing the date/time that the video was initialy created on. </td>
        </tr>
        <tr>
            <td> date_modified </td>
            <td> A string representing the date/time that the video last had a property modified, excluding <code>rank</code>. </td>
        </tr>
        <tr>
            <td> src</td>
            <td> A path to the video file. </td>
        </tr>
        <tr>
            <td> thumbnail_src </td>
            <td> A path to the video thumbnail image file. </td>
        </tr>
         <tr>
            <td> rank </td>
            <td> An integer representing the video's order in the course. This integer is unique for each video with the same <code>course_id</code>. The video with the highest <code>rank</code> in a course should appear first when presenting a list to the user. </td>
        </tr>
    </tbody>
</table>


+ Parameters
    + video_id: ZCkVzVWkOH (required, string) - ID of the video


### View a Video's Detail [GET]

+ Response 200 (application/json)

    + Body

            {
                "course_id": "JpecxxQCUcQ",
                "date_modified": "2016-09-11T14:05:48.047Z",
                "date_uploaded": "2015-11-29T20:42:25.000Z",
                "description": "Eos minus quia expedita qui quaerat sint quibusdam.",
                "duration": "937.10",
                "id": "PbMs7ma8knf",
                "rank": 23,
                "src": "/videos/published/PbMs7ma8knf/PbMs7ma8knf.mp4",
                "thumbnail_src": "/videos/published/PbMs7ma8knf/thumb.jpg",
                "title": "Expanded incremental function"
            }


