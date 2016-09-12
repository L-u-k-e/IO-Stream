FORMAT: 1A

# IO-Stream

IO-Stream is a platform that allows teachers to share lectures with students.


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





## Group Course

A course can be thought of as a "topic instance". For example, Professor B. Pancake might be teaching the topic 'Introduction to Computer Science' in Fall 2018. This is a course. Courses are managed by the publishers that are teaching them. Any publisher can create a new course under any topic. Professors may not modify/delete courses that they did not create, but administrators can modify/delete any course no matter who it belongs to.

## Course [/courses/{course_id}]

A Course object has the following attributes:

<table>
    <thead>
        <th>Attribue</th>
        <th>Description</th>
    </thead>
    <tbody>
        <tr>
            <td> id </td>
            <td>A base 64 encoded unique identifier for the course.</td>
        </tr>
        <tr>
            <td> topic_id </td>
            <td>The ID (UUID) of the topic that the course is teaching.</td>
        </tr>
        <tr>
            <td> semester_id </td>
            <td>The ID (serial number) of the semester in which the course is being taught.</td>
        </tr>
        <tr>
            <td> year </td>
            <td>The numeric value of the year that the course is being taught.</td>
        </tr>
        <tr>
            <td> section </td>
            <td>Either  NULL or a single character identifier to distinguish the course from other courses being taught by the same professor in the same semester / year (on the same topic).</td>
        </tr>
    </tbody>
</table>

+ Parameters
    + course_id: ONRqoFKrUWp (required, string) - ID of the topic


### View a Course's Detail [GET]

+ Response 200 (application/json)

    + Body
    
            {
                "id" : "C2CvJusG0g1",
                "person_id" : "Cathryn.Romaguera",
                "section" : "A",
                "semester_id" : 4,
                "topic_id" : "FPbC83Uxknz",
                "year" : 2007
            }