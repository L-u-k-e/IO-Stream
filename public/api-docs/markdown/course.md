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