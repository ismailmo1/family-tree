// ----------------family1-----------------------
// people
CREATE (dad:Person {name:'Naeem', id:"1"})
CREATE (mum:Person {name:'Farheen', id:"2"})
CREATE (child1:Person {name:'Tahurah', id:"3", username:'user1', hashed_password:'$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW'})
CREATE (child2:Person {name:'Umar', id:"4"})
CREATE (child3:Person {name:'Rumaisah', id:"5"})

// relationships
CREATE (dad)-[:SPOUSE_OF]->(mum)
CREATE (dad)<-[:CHILD_OF]-(child1)-[:CHILD_OF]->(mum)
CREATE (dad)<-[:CHILD_OF]-(child2)-[:CHILD_OF]->(mum)
CREATE (dad)<-[:CHILD_OF]-(child3)-[:CHILD_OF]->(mum)

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

CREATE (sib1:Person {name:'Ismail', id:"13"})
CREATE (sib2:Person {name:'Kulsoom', id:"14"})
CREATE (sib3:Person {name:'Hafiza', id:"15"})
CREATE (sib4:Person {name:'Halima', id:"16"})
CREATE (grandad:Person {name:'Faruk', id:"a", dob:"01/01/1960"})
CREATE (grandma:Person {name:'Zohra', id:"b", dob:"31/12/1962"})
CREATE (grandad)-[:SPOUSE_OF]->(grandma)

CREATE (grandad)<-[:CHILD_OF]-(sib1)-[:CHILD_OF]->(grandma)
CREATE (grandad)<-[:CHILD_OF]-(sib2)-[:CHILD_OF]->(grandma)
CREATE (grandad)<-[:CHILD_OF]-(sib3)-[:CHILD_OF]->(grandma)
CREATE (grandad)<-[:CHILD_OF]-(sib4)-[:CHILD_OF]->(grandma)
CREATE (grandad)<-[:CHILD_OF]-(dad)-[:CHILD_OF]->(grandma)
CREATE (grandad)<-[:CHILD_OF]-(dad2)-[:CHILD_OF]->(grandma)