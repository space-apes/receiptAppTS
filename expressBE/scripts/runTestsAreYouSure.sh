#!/bin/bash

echo "running this test is destructive to the TEST DATABASE."
echo "are you sure you want to run tests on this database?"
echo "type 'y' for yes and anything else for no."
read response


if [[ "$response" == "y" ]]; then
    npx jest --detectOpenHandles
else 
	echo "your action has been cancelled and any databases have not been affected"
fi
