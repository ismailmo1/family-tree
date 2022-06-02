// family1
// people
CREATE (dad:Person {name:'family1_dad', id:1})
CREATE (mum:Person {name:'family1_mum', id:2})
CREATE (child1:Person {name:'family1_child1', id:3})
CREATE (child2:Person {name:'family1_child2', id:4})
CREATE (child3:Person {name:'family1_child3', id:5})
CREATE (child4:Person {name:'family1_child4', id:6})

// relationships
CREATE (dad)-[:SPOUSE_OF]->(mum)
CREATE (dad)<-[:CHILD_OF]-(child1)-[:CHILD_OF]->(mum)
CREATE (dad)<-[:CHILD_OF]-(child2)-[:CHILD_OF]->(mum)
CREATE (dad)<-[:CHILD_OF]-(child3)-[:CHILD_OF]->(mum)
CREATE (dad)<-[:CHILD_OF]-(child4)-[:CHILD_OF]->(mum)
