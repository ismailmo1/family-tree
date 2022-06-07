// ----------------family1-----------------------
// people
CREATE (dad:Person {name:'family1_dad', id:"1"})
CREATE (mum:Person {name:'family1_mum', id:"2"})
CREATE (child1:Person {name:'family1_child1', id:"3", username:'user1', hashed_password:'$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW'})
CREATE (child2:Person {name:'family1_child2', id:"4"})
CREATE (child3:Person {name:'family1_child3', id:"5"})
CREATE (child4:Person {name:'family1_child4', id:"6"})
CREATE (exwife:Person {name:"family1_exwife", id: "7"})
CREATE (stepchild:Person {name:'family1_stepchild', id:"8"})

// relationships
CREATE (dad)-[:SPOUSE_OF]->(mum)
CREATE (dad)<-[:CHILD_OF]-(child1)-[:CHILD_OF]->(mum)
CREATE (dad)<-[:CHILD_OF]-(child2)-[:CHILD_OF]->(mum)
CREATE (dad)<-[:CHILD_OF]-(child3)-[:CHILD_OF]->(mum)
CREATE (dad)<-[:CHILD_OF]-(child4)-[:CHILD_OF]->(mum)
CREATE (dad)<-[:CHILD_OF]-(stepchild)-[:CHILD_OF]->(exwife)

// ----------------family2-----------------------
// people
CREATE (dad2:Person {name:'family2_dad', id:"9"})
CREATE (mum2:Person {name:'family2_mum', id:"10"})
CREATE (child21:Person {name:'family2_child1', id:"11"})
CREATE (child22:Person {name:'family2_child2', id:"12"})

// relationships
CREATE (dad2)-[:SPOUSE_OF]->(mum2)
CREATE (dad2)<-[:CHILD_OF]-(child21)-[:CHILD_OF]->(mum2)
CREATE (dad2)<-[:CHILD_OF]-(child22)-[:CHILD_OF]->(mum2)

// ----------------extended family-----------------------

CREATE (grandad:Person {name:'grandad', id:"a", dob:"01/01/1960"})
CREATE (grandma:Person {name:'grandma', id:"b", dob:"31/12/1962"})
CREATE (grandad)-[:SPOUSE_OF]->(grandma)

CREATE (grandad)<-[:CHILD_OF]-(dad)-[:CHILD_OF]->(grandma)
CREATE (grandad)<-[:CHILD_OF]-(dad2)-[:CHILD_OF]->(grandma)