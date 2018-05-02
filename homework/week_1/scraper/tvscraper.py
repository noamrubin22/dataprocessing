#!/usr/bin/env python
# Name: Noam Rubin
# Student number: 10800565
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
import re
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    # create lists
    title_serie = []
    ratings_serie = []
    genre_serie = []
    actors_serie= []
    runtime_serie = []
    complete_info_series = []

    # iterate over series on page and add to lists
    for serie in dom.find_all('div', class_="lister-item-content"):

        # extract titles
        title = serie.find('h3', class_="lister-item-header").a.text
        title_serie.append(title)

        # extract ratings
        ratings = serie.find('div', class_="inline-block ratings-imdb-rating").strong.text
        ratings_serie.append(ratings)

        # extract genres
        genre = serie.find('span', class_="genre").text.strip("\n")
        genre_serie.append(genre.strip())

        # create string 
        actors = ""

        # extract actors 
        for actor in serie.find_all(class_="", href=re.compile("name")):

            # add actor to actor-string
            actors += actor.text + ", "

        # add actors to list and remove unneccesarities
        actors_serie.append(actors.replace("\n", "").strip())

        # extract runtime (only number)
        runtime = serie.find('span', class_="runtime").contents[0].strip("min")
        runtime_serie.append(runtime)

    # add lists to the complete_info list
    complete_info_series = list(zip(title_serie, ratings_serie, genre_serie, actors_serie, runtime_serie))
      
    return complete_info_series   


def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # write info tv serie in every row file
    for serie in tvseries:
        writer.writerow(serie)


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)