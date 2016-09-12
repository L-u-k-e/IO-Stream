## Group Topic

Underneath subjects, topics are the second most general organization unit provided by the IO-Stream platform.
An example of a topic might be 'Introduction to Computer Science'.
  
Topics don't actually have videos, but instead have courses, which are instances of a topic actually being taught.
For example, Professor B. Pancake might be teaching the topic 'Introduction to Computer Science' in Fall 2018. This is a course. The courses are managed by the publishers that are teaching them, but only administrators can add/modify/delete topics. 

## Topic [/topics/{topic_id}]

A topic object has the following attributes:

<table>
    <thead>
        <th>Attribue</th>
        <th>Description</th>
    </thead>
    <tbody>
        <tr>
            <td> id </td>
            <td> A base 64 encoded unique identifier for the topic. </td>
        </tr>
        <tr>
            <td> subject_id </td>
            <td> The ID (serial number) of the subject that the topic belongs to. </td>
        </tr>
        <tr>
            <td> title </td>
            <td> The topic title. </td>
        </tr>
        <tr>
            <td> description </td>
            <td> A description of the topic. </td>
        </tr>
        <tr>
            <td> date_created </td>
            <td> A string representing the date that the topic was initialy created on. </td>
        </tr>
    </tbody>
</table>


+ Parameters
    + topic_id: ONRqoFKrUWp (required, string) - ID of the topic


### View a Topic's Detail [GET]

+ Response 200 (application/json)

    + Body

            {
                "date_created": "2016-09-11T04:00:00.000Z",
                "description": "Porro similique ullam repudiandae inventore ab repudiandae nesciunt.",
                "id": "ONRqoFKrUWp",
                "subject_id": 28,
                "title": "Handcrafted Fresh Gloves"
            }




