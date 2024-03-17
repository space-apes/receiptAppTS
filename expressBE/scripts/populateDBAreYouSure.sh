#!/bin/bash

echo "running this script is destructive to tables on database set by NODE_ENV."
echo "are you sure you want to this?"
echo "type 'y' for yes and anything else for no."
read response


if [[ "$response" == "y" ]]; then
    npx ts-node ./scripts/populateDB.ts
else 
	echo "your action has been cancelled no databases have been affected"
fi
