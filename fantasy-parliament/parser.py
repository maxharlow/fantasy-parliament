from urllib2 import urlopen
from datetime import datetime, timedelta
from lxml import etree



PP_URL='http://ukparse.kforge.net/parldata/scrapedxml/debates/'

class update_scores(object):
    def __init__(self, start_year, start_month, start_day):
        self.start='%d-%d-%d' %(start_year, start_month, start_day)
        self.voting={} #matches speaker with list of vote objects
        self.speak={} #matches speaker with list of speech url
        self.divisions={} #matches url with ayes, noes
        now_date=datetime.strptime(self.start, '%Y-%m-%d')
        for delta in xrange(1,7):
            date_string=now_date.strftime('%Y-%m-%d')
            for i in ['a', 'b', 'c']:
                xml_name=PP_URL+ 'debates'+ date_string + i + '.xml'
                try:
                    foo=urlopen(xml_name).read()
                    print xml_name
                except:
                    continue
            self.voting, self.speak, self.divisions=search_Division(foo, self.voting, self.speak, self.divisions,date_string)
            now_date=now_date + timedelta(days=1)        
    
    def vote_score(self, id):
        if id in self.voting:
            score=len(self.voting[id])
        else:
            score=0
        
        return score

    def speak_score(self, id):
        if id in self.speak:
            score=len(self.speak[id])
        else:
            score=0
        return score
        
            
class vote(object):
    def __init__(self, datestr, div_id, vote_type):
        self.date=datestr
        self.div_id=div_id
        self.vote_type=vote_type
    
def search_Division(xml_string, voting, speak, division_dict, datestr):
    root=etree.fromstring(xml_string)
    division_list=root.findall('division')
    for division in division_list:
        div_id=division.get('url')[38:]
        if div_id not in division_dict:
            div_count=division.find('divisioncount')
            division_dict[div_id]=[div_count.get('ayes'), div_count.get('noes')]
            
        for mplist in division.findall('mplist'):
            type=mplist.get('vote')
            for mp in mplist.iterchildren():
                mp_id=mp.get('id')[-5:]
                if mp_id in voting:
                    voting[mp_id].append(vote(datestr, div_id, type))
                else:
                    voting[mp_id]=[vote(datestr, div_id, type)]
    
    speech_list=root.findall('speech')
    
    for speech in speech_list:
        if not speech.get('nospeaker'):
            speaker=speech.get('speakerid')[-5:]
            if speaker in speak:
                #got rid of domain name
                speak[speaker].append(speech.get('url')[38:])
            else:
                speak[speaker]=[speech.get('url')[38:]]
    return voting, speak, division_dict     


        
        
